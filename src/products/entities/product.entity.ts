import { Entity, Index } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { TextColumn } from '../../db/columns/text-column';

@Entity()
export class Product extends BaseEntity {
  @Index({ unique: true })
  @TextColumn()
  sku: string;

  @TextColumn()
  name: string;
}
