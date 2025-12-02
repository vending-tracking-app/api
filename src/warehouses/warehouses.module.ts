import { Module } from '@nestjs/common';

import { WarehousesService } from './warehouses.service';
import { WarehousesRepository } from './warehouses.repository';

@Module({
  providers: [WarehousesService, WarehousesRepository],
  exports: [WarehousesService],
})
export class WarehousesModule {}
