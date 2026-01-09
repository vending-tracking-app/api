import { Module } from '@nestjs/common';

import { WarehousesModule } from '../warehouses/warehouses.module';
import { StockMovementsModule } from '../stock-movements/stock-movements.module';
import { ShiftOperationsController } from './shift-operations.controller';
import { ShiftOperationsService } from './shift-operations.service';
import { ShiftOperationsRepository } from './shift-operations.repository';

@Module({
  imports: [WarehousesModule, StockMovementsModule],
  controllers: [ShiftOperationsController],
  providers: [ShiftOperationsService, ShiftOperationsRepository],
})
export class ShiftOperationsModule {}
