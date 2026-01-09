import { Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { UUIDColumn } from '../../db/columns/uuid-column';
import { TextColumn } from '../../db/columns/text-column';
import { ShiftOperationType } from '../constants/shift-operation-type.constant';
import { Machine } from '../../machines/entities/machine.entity';
import { User } from '../../users/entities/user.entity';
import { StockMovement } from '../../stock-movements/entities/stock-movement.entity';

@Entity()
export class ShiftOperation extends BaseEntity {
  @TextColumn()
  type: ShiftOperationType;

  @UUIDColumn()
  machineId: string;

  @ManyToOne(() => Machine, { nullable: false })
  machine?: Machine;

  @UUIDColumn()
  createdById: string;

  @ManyToOne(() => User, { nullable: false })
  createdBy?: User;

  @TextColumn({ nullable: true })
  note: string | null;

  @OneToMany(
    () => StockMovement,
    (stockMovement) => stockMovement.shiftOperation,
  )
  stockMovements?: StockMovement[];
}
