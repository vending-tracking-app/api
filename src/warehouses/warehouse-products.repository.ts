import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

import { BaseRepository } from '../db/base.repository';
import { WarehouseProduct } from './entities/warehouse-product.entity';

@Injectable()
export class WarehouseProductsRepository extends BaseRepository<WarehouseProduct> {
  constructor(txHost: TransactionHost<TransactionalAdapterTypeOrm>) {
    super(txHost, WarehouseProduct);
  }
}
