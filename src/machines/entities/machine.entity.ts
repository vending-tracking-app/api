import { Entity, Index, OneToOne } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { TextColumn } from '../../db/columns/text-column';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';

@Entity()
export class Machine extends BaseEntity {
  @Index({ unique: true })
  @TextColumn()
  name: string;

  @TextColumn()
  location: string;

  @OneToOne(() => Warehouse, (warehouse) => warehouse.machine)
  warehouse?: Warehouse;
}
