import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

import { BaseRepository } from '../db/base.repository';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsRepository extends BaseRepository<Product> {
  constructor(txHost: TransactionHost<TransactionalAdapterTypeOrm>) {
    super(txHost, Product);
  }
}
