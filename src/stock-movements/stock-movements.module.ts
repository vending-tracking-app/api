import { Module } from '@nestjs/common';

import { WarehousesModule } from '../warehouses/warehouses.module';
import { StockMovementsController } from './stock-movements.controller';
import { StockMovementsService } from './stock-movements.service';
import { StockMovementsRepository } from './stock-movements.repository';
import { StockMovementItemsRepository } from './stock-movement-items.repository';

@Module({
  imports: [WarehousesModule],
  controllers: [StockMovementsController],
  providers: [
    StockMovementsService,
    StockMovementsRepository,
    StockMovementItemsRepository,
  ],
  exports: [StockMovementsService],
})
export class StockMovementsModule {}
