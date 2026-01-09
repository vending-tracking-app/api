import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

import { BaseRepository } from '../db/base.repository';
import { ShiftOperation } from './entities/shift-operation.entity';

@Injectable()
export class ShiftOperationsRepository extends BaseRepository<ShiftOperation> {
  constructor(txHost: TransactionHost<TransactionalAdapterTypeOrm>) {
    super(txHost, ShiftOperation);
  }
}
