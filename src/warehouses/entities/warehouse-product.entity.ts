import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { UUIDColumn } from '../../db/columns/uuid-column';
import { NumberColumn } from '../../db/columns/number-column';
import { Warehouse } from './warehouse.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
@Index(['warehouseId', 'productId'], { unique: true })
export class WarehouseProduct extends BaseEntity {
  @UUIDColumn()
  warehouseId: string;

  @ManyToOne(() => Warehouse, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouseId', referencedColumnName: 'id' })
  warehouse?: Warehouse;

  @UUIDColumn()
  productId: string;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product?: Product;

  @NumberColumn({ default: 0 })
  quantity: number;
}
