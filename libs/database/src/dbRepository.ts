import { IDbRepository } from './dbRepository.interface';
import { knex } from './knexInstance';

export abstract class DbRepository<T extends { id: number }> implements IDbRepository<T> {
  protected constructor(protected readonly tableName: string) {}

  public async insert(entity: Partial<T> | Partial<T>[]): Promise<number> {
    // make sure we don't try to insert id
    const entityWithoutId =
      entity instanceof Array ? entity.map(e => this.removeId(e)) : this.removeId(entity);

    return knex<T>(this.tableName)
      .insert(entityWithoutId as any)
      .then(id => id[0]);
  }

  public async select(where?: Partial<T>): Promise<T[]>;
  public async select(where: Partial<T>, unique: true): Promise<T>;
  public async select(where?: Partial<T>, unique?: true): Promise<T | T[]> {
    if (!where) {
      // get()
      return knex<T>(this.tableName).then(res => res as T[]);
    }

    if (unique) {
      // get(where, unique)
      return knex<T>(this.tableName)
        .where(where)
        .first()
        .then(res => res as T);
    }

    // get(where)
    return knex<T>(this.tableName)
      .where(where)
      .then(res => res as T[]);
  }

  public async count(where?: Partial<T>, columnName?: keyof T | '*'): Promise<number> {
    return knex<T>(this.tableName)
      .where(where || {})
      .count({ count: columnName || 'id' })
      .then(res => res[0].count);
  }

  public async update(where: Partial<T>, data: Partial<T>): Promise<void> {
    // make sure we don't try to update id
    const dataWithoutId = this.removeId(data);

    return knex<T>(this.tableName)
      .where(where)
      .update(dataWithoutId as any);
  }

  public async delete(where: Partial<T>): Promise<void> {
    return knex<T>(this.tableName)
      .where(where)
      .del();
  }

  private removeId(obj: Partial<T>): Omit<Partial<T>, 'id'> {
    const { id, ...rest } = obj;
    return rest;
  }
}
