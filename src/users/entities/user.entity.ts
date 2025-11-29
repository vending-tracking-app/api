import { Entity, Index } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { TextColumn } from '../../db/columns/text-column';
import { BooleanColumn } from '../../db/columns/boolean-column';

export enum UserRole {
  ADMIN = 'ADMIN',
  EXPEDITOR = 'EXPEDITOR',
}

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

  @TextColumn()
  role: UserRole;
}
