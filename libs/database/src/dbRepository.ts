import { IDbRepository } from './dbRepository.interface';
import { knex } from './knexInstance';

export abstract class DbRepository<T> implements IDbRepository<T> {
  protected constructor(protected readonly tableName: string) {}

  public async create(entity: Partial<T> | Partial<T>[]): Promise<number> {
    return (await knex<T>(this.tableName).insert(entity as any))[0];
  }

  public async get(): Promise<T[]>;
  public async get(where: Partial<T>): Promise<T[]>;
  public async get(where: Partial<T>, unique: true): Promise<T>;
  public async get(where?: Partial<T>, unique?: true): Promise<T | T[]> {
    if (!where) {
      // get()
      return (await knex<T>(this.tableName)) as T[];
    }

    if (unique) {
      // get(where, unique)
      return (await knex<T>(this.tableName)
        .where(where)
        .first()) as T;
    }

    // get(where)
    return (await knex<T>(this.tableName).where(where)) as T[];
  }

  public async update(where: Partial<T>, data: Partial<T>): Promise<void> {
    await knex<T>(this.tableName)
      .where(where)
      .update(data as any);
  }
}
