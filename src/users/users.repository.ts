import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

import { BaseRepository } from '../db/base.repository';
import { User } from './entities/user.entity';

/**
 * This repository should be used only to retrieve users from the database.
 * For other operations, use the AuthService.
 */
@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(txHost: TransactionHost<TransactionalAdapterTypeOrm>) {
    super(txHost, User);
  }
}
