import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { UUIDColumn } from '../../db/columns/uuid-column';
import { TextColumn } from '../../db/columns/text-column';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { User } from '../../users/entities/user.entity';
import { StockMovementType } from '../constants/stock-movement-type.constant';
import { StockMovementItem } from './stock-movement-item.entity';

@Entity()
export class StockMovement extends BaseEntity {
  @UUIDColumn()
  fromWarehouseId: string;

  @ManyToOne(() => Warehouse, { nullable: false })
  @JoinColumn({ name: 'fromWarehouseId', referencedColumnName: 'id' })
  fromWarehouse?: Warehouse;

  @UUIDColumn()
  toWarehouseId: string;

  @ManyToOne(() => Warehouse, { nullable: false })
  @JoinColumn({ name: 'toWarehouseId', referencedColumnName: 'id' })
  toWarehouse?: Warehouse;

  @TextColumn()
  type: StockMovementType;

  @UUIDColumn()
  createdById: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById', referencedColumnName: 'id' })
  createdBy?: User | null;

  @TextColumn({ nullable: true })
  note: string | null;

  @OneToMany(() => StockMovementItem, (item) => item.movement)
  items?: StockMovementItem[];
}
