import { Injectable } from '@nestjs/common';

import { WarehousesRepository } from './warehouses.repository';
import { Warehouse } from './entities/warehouse.entity';
import { WarehouseType } from './constants/warehouse-type.constant';

export interface CreateWarehouseParams {
  type: WarehouseType;
  userId?: string;
  machineId?: string;
}

@Injectable()
export class WarehousesService {
  constructor(private readonly warehousesRepository: WarehousesRepository) {}

  async create(params: CreateWarehouseParams): Promise<Warehouse> {
    const { type, userId, machineId } = params;
    const warehouse = this.warehousesRepository.create({
      type,
      userId,
      machineId,
    });
    return this.warehousesRepository.save(warehouse);
  }
}
