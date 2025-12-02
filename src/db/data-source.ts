import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Account } from '../auth/entities/account.entity';
import { Session } from '../auth/entities/session.entity';
import { Verification } from '../auth/entities/verification.entity';
import { Product } from '../products/entities/product.entity';
import { Machine } from '../machines/entities/machine.entity';
import { Warehouse } from '../warehouses/entities/warehouse.entity';
import { WarehouseProduct } from '../warehouses/entities/warehouse-product.entity';

import { AddBetterAuthEntities1764363602239 } from './migrations/1764363602239-add-better-auth-entities';
import { AddBetterAuthAdminPlugin1764582819799 } from './migrations/1764582819799-add-better-auth-admin-plugin';
import { AddProductEntity1764688644514 } from './migrations/1764688644514-add-product-entity';
import { AddMachineEntity1764689414848 } from './migrations/1764689414848-add-machine-entity';
import { AddWarehouseEntity1764695803005 } from './migrations/1764695803005-add-warehouse-entity';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [
    User,
    Account,
    Session,
    Verification,
    Product,
    Machine,
    Warehouse,
    WarehouseProduct,
  ],
  migrations: [
    AddBetterAuthEntities1764363602239,
    AddBetterAuthAdminPlugin1764582819799,
    AddProductEntity1764688644514,
    AddMachineEntity1764689414848,
    AddWarehouseEntity1764695803005,
  ],
});

export default dataSource;
