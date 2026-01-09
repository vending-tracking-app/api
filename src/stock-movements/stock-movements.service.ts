import { Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';

import { ContextService } from '../context/context.service';
import { StockMovementsRepository } from './stock-movements.repository';
import { StockMovementItemsRepository } from './stock-movement-items.repository';
import { StockMovementType } from './constants/stock-movement-type.constant';
import { WarehousesService } from '../warehouses/warehouses.service';
import { WarehouseType } from '../warehouses/constants/warehouse-type.constant';
import { Warehouse } from '../warehouses/entities/warehouse.entity';

interface CreateStockMovementParams {
  fromId?: string;
  toId?: string;
  type: StockMovementType;
  note?: string | null;
  items: { productId: string; quantity: number }[];
  shiftOperationId?: string;
}

@Injectable()
export class StockMovementsService {
  constructor(
    private readonly contextService: ContextService,
    private readonly stockMovementsRepository: StockMovementsRepository,
    private readonly stockMovementItemsRepository: StockMovementItemsRepository,
    private readonly warehousesService: WarehousesService,
  ) {}

  @Transactional()
  async create(params: CreateStockMovementParams) {
    const { fromId, toId, type, note, items, shiftOperationId } = params;

    const { fromWarehouse, toWarehouse } =
      await this.getWarehousesForStockMovement({
        type,
        fromId,
        toId,
      });

    const movement = await this.stockMovementsRepository.save(
      this.stockMovementsRepository.create({
        createdById: this.contextService.get('userId'),
        fromWarehouseId: fromWarehouse?.id,
        toWarehouseId: toWarehouse?.id,
        type,
        note,
        shiftOperationId,
      }),
    );

    const movementItems = await this.stockMovementItemsRepository.saveMany(
      items.map((item) =>
        this.stockMovementItemsRepository.create({
          movementId: movement.id,
          productId: item.productId,
          quantity: item.quantity,
        }),
      ),
    );

    await this.warehousesService.recalculateStocks(movement, movementItems);
  }

  private async getWarehousesForStockMovement({
    type,
    fromId,
    toId,
  }: {
    type: StockMovementType;
    fromId?: string;
    toId?: string;
  }): Promise<{
    fromWarehouse: Warehouse;
    toWarehouse: Warehouse;
  }> {
    switch (type) {
      case StockMovementType.MARKET_TO_USER: {
        const userId = toId;

        if (!userId) {
          throw new Error('Market to user movement must have a to ID');
        }

        const marketWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.MARKET,
        });

        const userWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.USER,
          userId,
        });

        return {
          fromWarehouse: marketWarehouse,
          toWarehouse: userWarehouse,
        };
      }

      case StockMovementType.USER_TO_USER: {
        if (!fromId || !toId) {
          throw new Error(
            'User to user movement must have a from ID and a to ID',
          );
        }

        const fromWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.USER,
          userId: fromId,
        });

        const toWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.USER,
          userId: toId,
        });

        return {
          fromWarehouse,
          toWarehouse,
        };
      }

      case StockMovementType.USER_TO_MACHINE: {
        if (!fromId || !toId) {
          throw new Error(
            'User to machine movement must have a from ID and a to ID',
          );
        }

        const fromWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.USER,
          userId: fromId,
        });

        const toWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.MACHINE,
          machineId: toId,
        });

        return {
          fromWarehouse,
          toWarehouse,
        };
      }

      case StockMovementType.MACHINE_TO_USER: {
        if (!fromId || !toId) {
          throw new Error(
            'Machine to user movement must have a from ID and a to ID',
          );
        }

        const fromWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.MACHINE,
          machineId: fromId,
        });

        const toWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.USER,
          userId: toId,
        });

        return {
          fromWarehouse,
          toWarehouse,
        };
      }

      case StockMovementType.MACHINE_TO_CUSTOMER: {
        if (!fromId) {
          throw new Error('Machine to customer movement must have a from ID');
        }

        const fromWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.MACHINE,
          machineId: fromId,
        });

        const toWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.CUSTOMER,
        });

        return {
          fromWarehouse,
          toWarehouse,
        };
      }

      case StockMovementType.USER_TO_WASTE: {
        if (!fromId) {
          throw new Error('User to waste movement must have a from ID');
        }

        const fromWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.USER,
          userId: fromId,
        });

        const toWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.WASTE,
        });

        return {
          fromWarehouse,
          toWarehouse,
        };
      }

      case StockMovementType.MACHINE_TO_WASTE: {
        if (!fromId) {
          throw new Error('Machine to waste movement must have a from ID');
        }

        const fromWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.MACHINE,
          machineId: fromId,
        });

        const toWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.WASTE,
        });

        return {
          fromWarehouse,
          toWarehouse,
        };
      }

      case StockMovementType.NOWHERE_TO_USER: {
        if (!toId) {
          throw new Error('Correction movement must have a to ID');
        }

        const fromWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.NOWHERE,
        });

        const toWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.USER,
          userId: toId,
        });

        return {
          fromWarehouse,
          toWarehouse,
        };
      }

      case StockMovementType.NOWHERE_TO_MACHINE: {
        if (!toId) {
          throw new Error('Correction movement must have a to ID');
        }

        const fromWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.NOWHERE,
        });

        const toWarehouse = await this.warehousesService.findOneByOrThrow({
          type: WarehouseType.MACHINE,
          machineId: toId,
        });

        return {
          fromWarehouse,
          toWarehouse,
        };
      }

      default:
        throw new Error('Invalid stock movement type');
    }
  }
}
