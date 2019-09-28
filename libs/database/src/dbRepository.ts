import { IDbRepository } from './dbRepository.interface';
import { knex } from './knexInstance';

export abstract class DbRepository<T> implements IDbRepository<T> {
  protected constructor(private readonly tableName: string) {}

  public async create(entity: Partial<T> | Partial<T>[]): Promise<number> {
    return (await knex<T>(this.tableName).insert(entity as any))[0];
  }

  public async get(id: number): Promise<T>;
  public async get(column: string, value: any): Promise<T[]>;
  public async get(column: string, value: any, unique: true): Promise<T>;
  public async get(
    columnOrId: string | number,
    value?: any,
    unique?: true
  ): Promise<T | T[]> {
    if (typeof columnOrId === 'number') {
      return await this.get('id', columnOrId, true);
    }

    if (unique) {
      return (await knex<T>(this.tableName)
        .where(columnOrId, value)
        .first()) as T;
    }

    return (await knex<T>(this.tableName).where(columnOrId, value)) as T[];
  }
}
