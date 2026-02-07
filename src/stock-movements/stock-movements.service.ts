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

    if (fromId === toId) {
      throw new Error('From ID and to ID cannot be the same');
    }

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

  async getMachineSales(params: {
    machineId: string;
    from?: string;
    to?: string;
    productId?: string;
  }): Promise<
    {
      productId: string;
      productName: string;
      points: { date: string; units: number }[];
    }[]
  > {
    const { machineId, from, to, productId } = params;

    const machineWarehouse = await this.warehousesService.findOneByOrThrow({
      type: WarehouseType.MACHINE,
      machineId,
    });

    const query = this.stockMovementsRepository
      .createQueryBuilder('movement')
      .innerJoin('movement.items', 'item')
      .innerJoin('item.product', 'product')
      .select("DATE_TRUNC('day', movement.createdAt)", 'date')
      .addSelect('item.productId', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('SUM(item.quantity)', 'units')
      .where('movement.type = :type', {
        type: StockMovementType.MACHINE_TO_CUSTOMER,
      })
      .andWhere('movement.fromWarehouseId = :warehouseId', {
        warehouseId: machineWarehouse.id,
      })
      .groupBy('date')
      .addGroupBy('item.productId')
      .addGroupBy('product.name')
      .orderBy('date', 'ASC');

    if (productId) {
      query.andWhere('item.productId = :productId', { productId });
    }

    if (from) {
      query.andWhere('movement.createdAt >= :from', {
        from: new Date(from),
      });
    }

    if (to) {
      const toDate = new Date(to);
      toDate.setDate(toDate.getDate() + 1);
      query.andWhere('movement.createdAt < :to', { to: toDate });
    }

    const rows = await query.getRawMany<{
      date: Date;
      productId: string;
      productName: string;
      units: string;
    }>();

    const seriesMap = new Map<
      string,
      {
        productId: string;
        productName: string;
        points: { date: string; units: number }[];
      }
    >();

    rows.forEach((row) => {
      const dateValue =
        row.date instanceof Date ? row.date : new Date(row.date);
      const date = dateValue.toISOString().slice(0, 10);
      const units = Number(row.units ?? 0);
      const existing = seriesMap.get(row.productId);

      if (existing) {
        existing.points.push({ date, units });
        return;
      }

      seriesMap.set(row.productId, {
        productId: row.productId,
        productName: row.productName,
        points: [{ date, units }],
      });
    });

    return Array.from(seriesMap.values());
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
