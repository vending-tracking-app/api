import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { User } from '../auth/entities/user';
import { Account } from '../auth/entities/account';
import { Session } from '../auth/entities/session';
import { Verification } from '../auth/entities/verification';

import { AddBetterAuthEntities1762033899857 } from './migrations/1762033899857-add-better-auth-entities';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [User, Account, Session, Verification],
  migrations: [AddBetterAuthEntities1762033899857],
});

export default dataSource;
