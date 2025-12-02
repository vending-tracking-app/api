import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Account } from '../auth/entities/account.entity';
import { Session } from '../auth/entities/session.entity';
import { Verification } from '../auth/entities/verification.entity';
import { Product } from '../products/entities/product.entity';

import { AddBetterAuthEntities1764363602239 } from './migrations/1764363602239-add-better-auth-entities';
import { AddBetterAuthAdminPlugin1764582819799 } from './migrations/1764582819799-add-better-auth-admin-plugin';
import { AddProductEntity1764688644514 } from './migrations/1764688644514-add-product-entity';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [User, Account, Session, Verification, Product],
  migrations: [
    AddBetterAuthEntities1764363602239,
    AddBetterAuthAdminPlugin1764582819799,
    AddProductEntity1764688644514,
  ],
});

export default dataSource;
