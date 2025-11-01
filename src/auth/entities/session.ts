import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { DateColumn } from '../../db/columns/date-column';
import { TextColumn } from '../../db/columns/text-column';
import { User } from './user';

@Entity()
export class Session extends BaseEntity {
  @DateColumn()
  expiresAt: Date;

  @Index({ unique: true })
  @TextColumn()
  token: string;

  @TextColumn({ nullable: true })
  ipAddress: string | null;

  @TextColumn({ nullable: true })
  userAgent: string | null;

  @TextColumn()
  userId: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: User;
}
