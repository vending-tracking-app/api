import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

import { BaseRepository } from '../db/base.repository';
import { StockMovementItem } from './entities/stock-movement-item.entity';

@Injectable()
export class StockMovementItemsRepository extends BaseRepository<StockMovementItem> {
  constructor(txHost: TransactionHost<TransactionalAdapterTypeOrm>) {
    super(txHost, StockMovementItem);
  }
}
