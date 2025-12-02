import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

import { BaseRepository } from '../db/base.repository';
import { Warehouse } from './entities/warehouse.entity';

@Injectable()
export class WarehousesRepository extends BaseRepository<Warehouse> {
  constructor(txHost: TransactionHost<TransactionalAdapterTypeOrm>) {
    super(txHost, Warehouse);
  }
}
