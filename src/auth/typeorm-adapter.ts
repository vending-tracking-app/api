import { BetterAuthError, BetterAuthOptions } from 'better-auth';
import { createAdapterFactory, DBAdapter, Where } from 'better-auth/adapters';
import {
  DataSource,
  FindOptionsWhere,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  ObjectLiteral,
} from 'typeorm';

function convertOperatorToTypeORM(operator: Where['operator'], value: unknown) {
  switch (operator) {
    case 'ne':
      return Not(value);
    case 'lt':
      return LessThan(value);
    case 'lte':
      return LessThanOrEqual(value);
    case 'gt':
      return MoreThan(value);
    case 'gte':
      return MoreThanOrEqual(value);
    case 'in':
      return In(value as unknown[]);
    case 'not_in':
      return Not(In(value as unknown[]));
    case 'contains':
      return Like(`%${value as string}%`);
    case 'starts_with':
      return Like(`${value as string}%`);
    case 'ends_with':
      return Like(`%${value as string}`);
    default:
      return value;
  }
}

export const typeormAdapter = (dataSource: DataSource) =>
  createAdapterFactory({
    config: {
      adapterId: 'typeorm',
      transaction: async (fn) => {
        const convertWhereToFindOptions = (
          where: Where[],
        ): FindOptionsWhere<ObjectLiteral> => {
          if (!where || where.length === 0) {
            return {};
          }

          const findOptions: FindOptionsWhere<ObjectLiteral> = {};

          for (const w of where) {
            if (!w.operator || w.operator === 'eq') {
              findOptions[w.field] = w.value;
            } else {
              findOptions[w.field] = convertOperatorToTypeORM(
                w.operator,
                w.value,
              );
            }
          }

          return findOptions;
        };

        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
          const manager = queryRunner.manager;

          const transactionalAdapter: DBAdapter<BetterAuthOptions> = {
            id: 'typeorm',
            async create<T extends Record<string, unknown>, R = T>(data: {
              model: string;
              data: Omit<T, 'id'>;
              select?: string[];
              forceAllowId?: boolean;
            }): Promise<R> {
              const { model, data: values } = data;
              const repository = manager.getRepository(model);
              const entity = repository.create(
                values as Record<string, unknown>,
              );
              const result = await repository.save(entity);
              return result as R;
            },
            async update<T>(data: {
              model: string;
              where: Where[];
              update: Record<string, unknown>;
            }): Promise<T | null> {
              const { model, where, update } = data;
              const repository = manager.getRepository(model);
              const findOptions = convertWhereToFindOptions(where);

              if (where.length === 1) {
                const updatedRecord = await repository.findOne({
                  where: findOptions,
                });
                if (updatedRecord) {
                  await repository.update(findOptions, update);
                  const result = await repository.findOne({
                    where: findOptions,
                  });
                  return result as T;
                }
              }

              await repository.update(findOptions, update);
              return null;
            },
            async delete(data): Promise<void> {
              const { model, where } = data;
              const repository = manager.getRepository(model);
              const findOptions = convertWhereToFindOptions(where);
              await repository.delete(findOptions);
            },
            async findOne<T>(data: {
              model: string;
              where: Where[];
              select?: string[];
            }): Promise<T | null> {
              const { model, where, select } = data;
              const repository = manager.getRepository(model);
              const findOptions = convertWhereToFindOptions(where);
              const result = await repository.findOne({
                where: findOptions,
                select,
              });
              return result as T | null;
            },
            async findMany<T>(data: {
              model: string;
              where?: Where[];
              limit?: number;
              offset?: number;
              sortBy?: { field: string; direction: 'asc' | 'desc' };
            }): Promise<T[]> {
              const { model, where, limit, offset, sortBy } = data;
              const repository = manager.getRepository(model);
              const findOptions = convertWhereToFindOptions(where || []);

              const result = await repository.find({
                where: findOptions,
                take: limit || 100,
                skip: offset || 0,
                order: sortBy?.field
                  ? {
                      [sortBy.field]:
                        sortBy.direction === 'desc' ? 'DESC' : 'ASC',
                    }
                  : undefined,
              });

              return result as T[];
            },
            async count(data): Promise<number> {
              const { model, where } = data;
              const repository = manager.getRepository(model);
              const findOptions = convertWhereToFindOptions(where || []);
              return await repository.count({ where: findOptions });
            },
            async updateMany(data): Promise<number> {
              const { model, where, update } = data;
              const repository = manager.getRepository(model);
              const findOptions = convertWhereToFindOptions(where);
              const result = await repository.update(findOptions, update);
              return result.affected ?? 0;
            },
            async deleteMany(data): Promise<number> {
              const { model, where } = data;
              const repository = manager.getRepository(model);
              const findOptions = convertWhereToFindOptions(where);
              const result = await repository.delete(findOptions);
              return result.affected ?? 0;
            },
            transaction: async <TR>(
              callback: (trx: DBAdapter<BetterAuthOptions>) => Promise<TR>,
            ): Promise<TR> => callback(transactionalAdapter),
          };

          const result = await fn(transactionalAdapter);
          await queryRunner.commitTransaction();
          return result;
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw error;
        } finally {
          await queryRunner.release();
        }
      },
    },
    adapter: ({
      transformWhereClause,
      getFieldName,
      transformInput,
      getModelName,
      transformOutput,
    }) => {
      function convertWhereToFindOptions(
        model: string,
        where?: Where[],
      ): FindOptionsWhere<ObjectLiteral> {
        if (!where || where.length === 0) return {};

        const cleanedWhere = transformWhereClause({ model, where });
        const findOptions: FindOptionsWhere<ObjectLiteral> = {};

        for (const w of cleanedWhere) {
          const field = getFieldName({ model, field: w.field });

          if (!w.operator || w.operator === 'eq') {
            findOptions[field] = w.value;
          } else {
            findOptions[field] = convertOperatorToTypeORM(w.operator, w.value);
          }
        }

        return findOptions;
      }

      return {
        async create<T extends Record<string, unknown>, R = T>(data: {
          model: string;
          data: Omit<T, 'id'>;
          select?: string[];
          forceAllowId?: boolean;
        }): Promise<R> {
          const { model, data: values, select } = data;
          const transformed = await transformInput(
            values,
            model,
            'create',
            data.forceAllowId,
          );

          const repositoryName = getModelName(model);
          const repository = dataSource.getRepository(repositoryName);

          try {
            const entity = repository.create(transformed);
            const result = await repository.save(entity);
            const output = await transformOutput(result, model, select);
            return output as R;
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : String(error);
            throw new BetterAuthError(`Failed to create ${model}: ${message}`);
          }
        },
        async update<T>(data: {
          model: string;
          where: Where[];
          update: T;
        }): Promise<T | null> {
          const { model, where, update } = data;
          const repositoryName = getModelName(model);
          const repository = dataSource.getRepository(repositoryName);

          try {
            const findOptions = convertWhereToFindOptions(model, where);
            const transformed = await transformInput(
              update as Record<string, unknown>,
              model,
              'update',
            );

            if (where.length === 1) {
              const updatedRecord = await repository.findOne({
                where: findOptions,
              });

              if (updatedRecord) {
                await repository.update(findOptions, transformed);
                const result = await repository.findOne({
                  where: findOptions,
                });

                if (result) {
                  const output = await transformOutput(result, model);
                  return output as T;
                }
              }
            }

            await repository.update(findOptions, transformed);
            return null;
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : String(error);
            throw new BetterAuthError(`Failed to update ${model}: ${message}`);
          }
        },
        async delete(data: { model: string; where: Where[] }): Promise<void> {
          const { model, where } = data;
          const repositoryName = getModelName(model);
          const repository = dataSource.getRepository(repositoryName);

          try {
            const findOptions = convertWhereToFindOptions(model, where);
            await repository.delete(findOptions);
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : String(error);
            throw new BetterAuthError(`Failed to delete ${model}: ${message}`);
          }
        },
        async findOne<T>(data: {
          model: string;
          where: Where[];
          select?: string[];
        }): Promise<T | null> {
          const { model, where, select } = data;
          const repositoryName = getModelName(model);
          const repository = dataSource.getRepository(repositoryName);

          try {
            const findOptions = convertWhereToFindOptions(model, where);
            const result = await repository.findOne({
              where: findOptions,
              select: select,
            });

            if (result) {
              const output = await transformOutput(result, model, select);
              return output as T;
            }

            return null;
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : String(error);
            throw new BetterAuthError(`Failed to find ${model}: ${message}`);
          }
        },
        async findMany<T>(data: {
          model: string;
          where?: Where[];
          limit?: number;
          offset?: number;
          sortBy?: { field: string; direction: 'asc' | 'desc' };
        }): Promise<T[]> {
          const { model, where, limit, offset, sortBy } = data;
          const repositoryName = getModelName(model);
          const repository = dataSource.getRepository(repositoryName);

          try {
            const findOptions = convertWhereToFindOptions(model, where);

            const result = await repository.find({
              where: findOptions,
              take: limit ?? 100,
              skip: offset ?? 0,
              order: sortBy?.field
                ? {
                    [sortBy.field]:
                      sortBy.direction === 'desc' ? 'DESC' : 'ASC',
                  }
                : undefined,
            });

            const transformed = await Promise.all(
              result.map((r) => transformOutput(r, model)),
            );
            return transformed as T[];
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : String(error);
            throw new BetterAuthError(
              `Failed to find many ${model}: ${message}`,
            );
          }
        },
        async count(data: { model: string; where?: Where[] }): Promise<number> {
          const { model, where } = data;
          const repositoryName = getModelName(model);
          const repository = dataSource.getRepository(repositoryName);

          try {
            const findOptions = convertWhereToFindOptions(model, where);
            const result = await repository.count({ where: findOptions });
            return result;
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : String(error);
            throw new BetterAuthError(`Failed to count ${model}: ${message}`);
          }
        },
        async updateMany(data: {
          model: string;
          where: Where[];
          update: Record<string, unknown>;
        }): Promise<number> {
          const { model, where, update } = data;
          const repositoryName = getModelName(model);
          const repository = dataSource.getRepository(repositoryName);

          try {
            const findOptions = convertWhereToFindOptions(model, where);
            const transformed = await transformInput(update, model, 'update');

            const result = await repository.update(findOptions, transformed);
            return result.affected ?? 0;
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : String(error);
            throw new BetterAuthError(
              `Failed to update many ${model}: ${message}`,
            );
          }
        },
        async deleteMany(data: {
          model: string;
          where: Where[];
        }): Promise<number> {
          const { model, where } = data;
          const repositoryName = getModelName(model);
          const repository = dataSource.getRepository(repositoryName);

          try {
            const findOptions = convertWhereToFindOptions(model, where);
            const result = await repository.delete(findOptions);
            return result.affected ?? 0;
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : String(error);
            throw new BetterAuthError(
              `Failed to delete many ${model}: ${message}`,
            );
          }
        },
      };
    },
  });
