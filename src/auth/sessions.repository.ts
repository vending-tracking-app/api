import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';

import { BaseRepository } from '../db/base.repository';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsRepository extends BaseRepository<Session> {
  constructor(txHost: TransactionHost<TransactionalAdapterTypeOrm>) {
    super(txHost, Session);
  }
}
