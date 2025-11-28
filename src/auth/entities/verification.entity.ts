import { Entity } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { TextColumn } from '../../db/columns/text-column';
import { DateColumn } from '../../db/columns/date-column';

@Entity()
export class Verification extends BaseEntity {
  @TextColumn()
  identifier: string;

  @TextColumn()
  value: string;

  @DateColumn()
  expiresAt: Date;
}
