import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { TextColumn } from '../../db/columns/text-column';
import { DateColumn } from '../../db/columns/date-column';
import { User } from './user';

@Entity()
export class Account extends BaseEntity {
  @TextColumn()
  accountId: string;

  @TextColumn()
  providerId: string;

  @TextColumn({ nullable: true })
  accessToken: string | null;

  @TextColumn({ nullable: true })
  refreshToken: string | null;

  @TextColumn({ nullable: true })
  idToken: string | null;

  @DateColumn({ nullable: true })
  accessTokenExpiresAt: Date | null;

  @DateColumn({ nullable: true })
  refreshTokenExpiresAt: Date | null;

  @TextColumn({ nullable: true })
  scope: string | null;

  @TextColumn({ nullable: true })
  password: string | null;

  @TextColumn()
  userId: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: User;
}
