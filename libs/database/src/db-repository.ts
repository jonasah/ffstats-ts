import { CreateTableBuilder } from 'knex';

import { IDbRepository } from './db-repository.interface';
import { knex } from './knex-instance';

export abstract class DbRepository<T> implements IDbRepository<T> {
  protected constructor(private readonly tableName: string) {}

  public async createTable(): Promise<void> {
    await knex.schema.createTable(this.tableName, table => this.createTableCallback(table));
  }

  public async create(entity: T): Promise<void> {
    await knex<T>(this.tableName).insert(this.getInsertData(entity));
  }

  public async getAll(): Promise<T[]> {
    return (await knex<T>(this.tableName)) as T[];
  }

  public async get(id: number): Promise<T> {
    return (await knex<T>(this.tableName)
      .where('Id', id)
      .first()) as T;
  }

  protected abstract createTableCallback(table: CreateTableBuilder): any;
  protected abstract getInsertData(entity: T): any;
}
