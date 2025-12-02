import { Entity, Index } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { TextColumn } from '../../db/columns/text-column';

@Entity()
export class Machine extends BaseEntity {
  @Index({ unique: true })
  @TextColumn()
  name: string;

  @TextColumn()
  location: string;
}
