import { Module } from '@nestjs/common';

import { WarehousesService } from './warehouses.service';
import { WarehousesRepository } from './warehouses.repository';
import { WarehouseProductsRepository } from './warehouse-products.repository';

@Module({
  providers: [
    WarehousesService,
    WarehousesRepository,
    WarehouseProductsRepository,
  ],
  exports: [WarehousesService],
})
export class WarehousesModule {}
