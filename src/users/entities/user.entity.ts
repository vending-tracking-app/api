import { Entity, Index, OneToOne } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { TextColumn } from '../../db/columns/text-column';
import { BooleanColumn } from '../../db/columns/boolean-column';
import { DateColumn } from '../../db/columns/date-column';
import { UserRole } from '../../auth/constants/user-role.constant';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';

@Entity()
export class User extends BaseEntity {
  @TextColumn()
  name: string;

  @Index({ unique: true })
  @TextColumn()
  email: string;

  @Index({ unique: true })
  @TextColumn({ nullable: true })
  phoneNumber: string | null;

  @BooleanColumn({ nullable: true })
  phoneNumberVerified: boolean | null;

  @BooleanColumn({ default: false })
  emailVerified: boolean;

  @TextColumn({ nullable: true })
  image: string | null;

  @TextColumn({ default: UserRole.USER })
  role: UserRole;

  @BooleanColumn({ nullable: true })
  banned: boolean | null;

  @TextColumn({ nullable: true })
  banReason: string | null;

  @DateColumn({ nullable: true })
  banExpires: Date | null;

  @OneToOne(() => Warehouse, (warehouse) => warehouse.user)
  warehouse?: Warehouse;
}
