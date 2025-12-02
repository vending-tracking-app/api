import { Entity, JoinColumn, OneToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { UUIDColumn } from '../../db/columns/uuid-column';
import { TextColumn } from '../../db/columns/text-column';
import { User } from '../../users/entities/user.entity';
import { Machine } from '../../machines/entities/machine.entity';
import { WarehouseType } from '../constants/warehouse-type.constant';
import { WarehouseProduct } from './warehouse-product.entity';

@Entity()
export class Warehouse extends BaseEntity {
  @TextColumn()
  type: WarehouseType;

  @UUIDColumn({ nullable: true })
  userId: string | null;

  @OneToOne(() => User, (user) => user.warehouse, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: User | null;

  @UUIDColumn({ nullable: true })
  machineId: string | null;

  @OneToOne(() => Machine, (machine) => machine.warehouse, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'machineId', referencedColumnName: 'id' })
  machine?: Machine | null;

  @OneToMany(
    () => WarehouseProduct,
    (warehouseProduct) => warehouseProduct.warehouse,
  )
  warehouseProducts?: WarehouseProduct[];
}
