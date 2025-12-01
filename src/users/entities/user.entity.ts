import { Entity, Index } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { TextColumn } from '../../db/columns/text-column';
import { BooleanColumn } from '../../db/columns/boolean-column';
import { DateColumn } from '../../db/columns/date-column';
import { UserRole } from '../../auth/constants/user-role.constant';

@Entity()
export class User extends BaseEntity {
  @TextColumn()
  name: string;

  @Index({ unique: true })
  @TextColumn()
  email: string;

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
}
