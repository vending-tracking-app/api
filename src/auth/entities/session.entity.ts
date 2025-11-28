import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { DateColumn } from '../../db/columns/date-column';
import { TextColumn } from '../../db/columns/text-column';
import { UUIDColumn } from '../../db/columns/uuid-column';
import { User } from './user.entity';

@Entity()
export class Session extends BaseEntity {
  @Index({ unique: true })
  @TextColumn()
  token: string;

  @DateColumn()
  expiresAt: Date;

  @TextColumn({ nullable: true })
  ipAddress: string | null;

  @TextColumn({ nullable: true })
  userAgent: string | null;

  @UUIDColumn()
  userId: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: User;
}
