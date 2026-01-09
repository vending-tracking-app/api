import { Injectable, Logger } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';

import { ShiftOperationType } from './constants/shift-operation-type.constant';
import { ContextService } from '../context/context.service';
import { ShiftOperationsRepository } from './shift-operations.repository';
import { WarehousesService } from '../warehouses/warehouses.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { WarehouseType } from '../warehouses/constants/warehouse-type.constant';
import { StockMovementType } from '../stock-movements/constants/stock-movement-type.constant';
import { ShiftOperation } from './entities/shift-operation.entity';

interface CreateShiftOperationParams {
  machineId: string;
  note?: string;
  type: ShiftOperationType;
  snapshot: { productId: string; quantity: number }[];
}

@Injectable()
export class ShiftOperationsService {
  private readonly logger = new Logger(ShiftOperationsService.name);

  constructor(
    private readonly contextService: ContextService,
    private readonly shiftOperationsRepository: ShiftOperationsRepository,
    private readonly warehousesService: WarehousesService,
    private readonly stockMovementsService: StockMovementsService,
  ) {}

  @Transactional()
  async create(params: CreateShiftOperationParams): Promise<void> {
    const { machineId, note, type, snapshot } = params;

    const createdById = this.contextService.get('userId');

    const shiftOperation = await this.shiftOperationsRepository.save(
      this.shiftOperationsRepository.create({
        type,
        machineId,
        createdById,
        note,
      }),
    );

    switch (type) {
      case ShiftOperationType.SHIFT_START:
        await this.handleShiftStart({
          shiftOperation,
          machineCurrentStock: snapshot,
        });
        break;

      case ShiftOperationType.SHIFT_END:
        await this.handleShiftEnd({
          shiftOperation,
          machineCurrentStock: snapshot,
        });
        break;
    }
  }

  private async handleShiftStart({
    shiftOperation,
    machineCurrentStock,
  }: {
    shiftOperation: ShiftOperation;
    machineCurrentStock: { productId: string; quantity: number }[];
  }): Promise<void> {
    const machineCurrentStockMap = new Map(
      machineCurrentStock.map((product) => [
        product.productId,
        product.quantity,
      ]),
    );

    const machineWarehouse = await this.warehousesService.findOneByOrThrow(
      {
        type: WarehouseType.MACHINE,
        machineId: shiftOperation.machineId,
      },
      { warehouseProducts: true },
    );

    const machinePrevStock = machineWarehouse.warehouseProducts.map(
      (product) => ({
        productId: product.productId,
        quantity: product.quantity,
      }),
    );

    const machinePrevStockMap = new Map(
      machinePrevStock.map((product) => [product.productId, product.quantity]),
    );

    const userToMachine: { productId: string; quantity: number }[] =
      machineCurrentStock
        .map((product) => {
          const prevQuantity = machinePrevStockMap.get(product.productId);
          return {
            productId: product.productId,
            quantity: product.quantity - (prevQuantity ?? 0),
          };
        })
        .filter((product) => product.quantity > 0);

    await this.stockMovementsService.create({
      type: StockMovementType.USER_TO_MACHINE,
      fromId: shiftOperation.createdById,
      toId: shiftOperation.machineId,
      items: userToMachine,
      shiftOperationId: shiftOperation.id,
    });

    const machineToUser: { productId: string; quantity: number }[] =
      machinePrevStock
        .map((product) => {
          const currentQuantity = machineCurrentStockMap.get(product.productId);
          return {
            productId: product.productId,
            quantity: product.quantity - (currentQuantity ?? 0),
          };
        })
        .filter((product) => product.quantity > 0);

    await this.stockMovementsService.create({
      type: StockMovementType.MACHINE_TO_USER,
      fromId: shiftOperation.machineId,
      toId: shiftOperation.createdById,
      items: machineToUser,
      shiftOperationId: shiftOperation.id,
    });
  }

  private async handleShiftEnd({
    shiftOperation,
    machineCurrentStock,
  }: {
    shiftOperation: ShiftOperation;
    machineCurrentStock: { productId: string; quantity: number }[];
  }): Promise<void> {
    const machineCurrentStockMap = new Map(
      machineCurrentStock.map((product) => [
        product.productId,
        product.quantity,
      ]),
    );

    const machineWarehouse = await this.warehousesService.findOneByOrThrow(
      {
        type: WarehouseType.MACHINE,
        machineId: shiftOperation.machineId,
      },
      { warehouseProducts: true },
    );

    const machinePrevStock = machineWarehouse.warehouseProducts.map(
      (product) => ({
        productId: product.productId,
        quantity: product.quantity,
      }),
    );

    const machinePrevStockMap = new Map(
      machinePrevStock.map((product) => [product.productId, product.quantity]),
    );

    const machineToCustomer: { productId: string; quantity: number }[] =
      machinePrevStock
        .map((product) => {
          const currentQuantity = machineCurrentStockMap.get(product.productId);
          return {
            productId: product.productId,
            quantity: product.quantity - (currentQuantity ?? 0),
          };
        })
        .filter((product) => product.quantity > 0);

    if (machineToCustomer.length > 0) {
      await this.stockMovementsService.create({
        type: StockMovementType.MACHINE_TO_CUSTOMER,
        fromId: shiftOperation.machineId,
        items: machineToCustomer,
        shiftOperationId: shiftOperation.id,
      });
    }

    const nowhereToMachine: { productId: string; quantity: number }[] =
      machineCurrentStock
        .map((product) => {
          const prevQuantity = machinePrevStockMap.get(product.productId);
          return {
            productId: product.productId,
            quantity: product.quantity - (prevQuantity ?? 0),
          };
        })
        .filter((product) => product.quantity > 0);

    if (nowhereToMachine.length > 0) {
      await this.stockMovementsService.create({
        type: StockMovementType.NOWHERE_TO_MACHINE,
        toId: shiftOperation.machineId,
        items: nowhereToMachine,
        shiftOperationId: shiftOperation.id,
      });
    }
  }
}
