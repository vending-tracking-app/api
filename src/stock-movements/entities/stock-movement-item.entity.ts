import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../db/base.entity';
import { StockMovement } from './stock-movement.entity';
import { UUIDColumn } from '../../db/columns/uuid-column';
import { Product } from '../../products/entities/product.entity';
import { NumberColumn } from '../../db/columns/number-column';

@Entity()
export class StockMovementItem extends BaseEntity {
  @UUIDColumn()
  movementId: string;

  @ManyToOne(() => StockMovement, (movement) => movement.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movementId', referencedColumnName: 'id' })
  movement?: StockMovement;

  @UUIDColumn()
  productId: string;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product?: Product;

  @NumberColumn({ default: 0 })
  quantity: number;
}
