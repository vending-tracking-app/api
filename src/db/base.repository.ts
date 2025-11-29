import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import {
  EntityTarget,
  FindOneOptions,
  FindOptionsRelations,
  ObjectLiteral,
} from 'typeorm';

export type WithRelations<E, R extends FindOptionsRelations<E>> = Omit<
  E,
  keyof R & keyof E
> & {
  [P in keyof R & keyof E]-?: R[P] extends true
    ? Exclude<E[P], undefined>
    : Exclude<E[P], undefined> extends Array<infer U>
      ? R[P] extends FindOptionsRelations<U>
        ? WithRelations<U, R[P]>[]
        : U[]
      : R[P] extends FindOptionsRelations<NonNullable<E[P]>>
        ? null extends E[P]
          ? WithRelations<NonNullable<E[P]>, R[P]> | null
          : WithRelations<NonNullable<E[P]>, R[P]>
        : E[P];
};

export abstract class BaseRepository<Entity extends ObjectLiteral> {
  constructor(
    protected readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
    protected readonly entity: EntityTarget<Entity>,
  ) {}

  protected get manager() {
    return this.txHost.tx;
  }

  protected get repository() {
    return this.manager.getRepository(this.entity);
  }

  async findOne<R extends FindOptionsRelations<Entity>>(
    options: Omit<FindOneOptions<Entity>, 'relations'> & {
      relations?: R;
    },
  ) {
    const result = await this.repository.findOne(options);

    if (!result) {
      return null;
    }

    return result as WithRelations<Entity, R>;
  }
}
