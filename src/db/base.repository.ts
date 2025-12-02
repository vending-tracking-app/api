import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  ObjectLiteral,
  Repository,
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

  protected get manager(): EntityManager {
    return this.txHost.tx;
  }

  protected get repository(): Repository<Entity> {
    return this.manager.getRepository(this.entity);
  }

  async find<R extends FindOptionsRelations<Entity>>(
    options?: Omit<FindManyOptions<Entity>, 'relations'> & {
      relations?: R;
    },
  ): Promise<WithRelations<Entity, R>[]> {
    const result = await this.repository.find(options);
    return result as WithRelations<Entity, R>[];
  }

  async findOne<R extends FindOptionsRelations<Entity>>(
    options: Omit<FindOneOptions<Entity>, 'relations'> & {
      relations?: R;
    },
  ): Promise<WithRelations<Entity, R> | null> {
    const result = await this.repository.findOne(options);

    if (!result) {
      return null;
    }

    return result as WithRelations<Entity, R>;
  }

  create(entityLike: DeepPartial<Entity>): Entity {
    return this.repository.create(entityLike);
  }

  async save(entity: Entity): Promise<Entity> {
    return this.repository.save(entity);
  }

  async saveMany(entities: Entity[]): Promise<Entity[]> {
    return this.repository.save(entities);
  }
}
