import { Module } from '@nestjs/common';

import { WarehousesModule } from '../warehouses/warehouses.module';
import { StockMovementsModule } from '../stock-movements/stock-movements.module';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';
import { MachinesRepository } from './machines.repository';

@Module({
  imports: [WarehousesModule, StockMovementsModule],
  controllers: [MachinesController],
  providers: [MachinesService, MachinesRepository],
  exports: [MachinesService],
})
export class MachinesModule {}
