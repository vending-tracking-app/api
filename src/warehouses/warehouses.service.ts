import { Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import { WarehousesRepository } from './warehouses.repository';
import { WarehouseProductsRepository } from './warehouse-products.repository';
import { Warehouse } from './entities/warehouse.entity';
import { WarehouseType } from './constants/warehouse-type.constant';
import { StockMovement } from '../stock-movements/entities/stock-movement.entity';
import { StockMovementItem } from '../stock-movements/entities/stock-movement-item.entity';

export interface CreateWarehouseParams {
  type: WarehouseType;
  userId?: string;
  machineId?: string;
}

@Injectable()
export class WarehousesService {
  constructor(
    private readonly warehousesRepository: WarehousesRepository,
    private readonly warehouseProductsRepository: WarehouseProductsRepository,
  ) {}

  async findOneBy(
    where: FindOptionsWhere<Warehouse>,
    relations?: FindOptionsRelations<Warehouse>,
  ) {
    return this.warehousesRepository.findOne({ where, relations });
  }

  async findOneByOrThrow(
    where: FindOptionsWhere<Warehouse>,
    relations?: FindOptionsRelations<Warehouse>,
  ) {
    const warehouse = await this.findOneBy(where, relations);

    if (!warehouse) {
      throw new Error('Warehouse not found');
    }

    return warehouse;
  }

  async create(params: CreateWarehouseParams) {
    const { type, userId, machineId } = params;

    if (type === WarehouseType.USER && !userId) {
      throw new Error('User warehouse can only be created for a user');
    }

    if (type === WarehouseType.MACHINE && !machineId) {
      throw new Error('Machine warehouse can only be created for a machine');
    }

    return this.warehousesRepository.save(
      this.warehousesRepository.create({
        type,
        userId,
        machineId,
      }),
    );
  }

  @Transactional()
  async recalculateStocks(
    stockMovement: StockMovement,
    stockMovementItems: StockMovementItem[],
  ) {
    const fromWarehouse = await this.findOneByOrThrow(
      { id: stockMovement.fromWarehouseId },
      { warehouseProducts: true },
    );

    const toWarehouse = await this.findOneByOrThrow(
      { id: stockMovement.toWarehouseId },
      { warehouseProducts: true },
    );

    if (
      fromWarehouse.type === WarehouseType.CUSTOMER ||
      fromWarehouse.type === WarehouseType.WASTE ||
      toWarehouse.type === WarehouseType.MARKET ||
      toWarehouse.type === WarehouseType.NOWHERE
    ) {
      throw new Error('Invalid warehouse type');
    }

    for (const movementItem of stockMovementItems) {
      if (
        fromWarehouse.type !== WarehouseType.MARKET &&
        fromWarehouse.type !== WarehouseType.NOWHERE
      ) {
        const fromWarehouseProduct = fromWarehouse.warehouseProducts.find(
          (product) => product.productId === movementItem.productId,
        );

        if (
          !fromWarehouseProduct ||
          fromWarehouseProduct.quantity < movementItem.quantity
        ) {
          throw new Error(
            'From warehouse product not found or quantity is less than movement item quantity',
          );
        }

        fromWarehouseProduct.quantity -= movementItem.quantity;
      }

      const toWarehouseProduct = toWarehouse.warehouseProducts.find(
        (product) => product.productId === movementItem.productId,
      );

      if (!toWarehouseProduct) {
        toWarehouse.warehouseProducts.push(
          this.warehouseProductsRepository.create({
            warehouseId: toWarehouse.id,
            productId: movementItem.productId,
            quantity: movementItem.quantity,
          }),
        );
      } else {
        toWarehouseProduct.quantity += movementItem.quantity;
      }
    }

    await this.warehouseProductsRepository.saveMany([
      ...fromWarehouse.warehouseProducts,
      ...toWarehouse.warehouseProducts,
    ]);
  }
}
