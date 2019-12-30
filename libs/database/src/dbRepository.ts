import Knex from 'knex';
import { knexConfig } from '../../../knex.config';
import { IDbRepository } from './dbRepository.interface';

export interface IModelEntityConverter<TModel, TEntity> {
  toEntity(model: Partial<TModel>): Partial<TEntity>;
  toModel(entity: TEntity): TModel;
}

export abstract class DbRepository<TModel, TEntity extends { id: number }>
  implements IDbRepository<TModel, TEntity> {
  protected readonly converter: IModelEntityConverter<TModel, TEntity>;

  private readonly knexInstance: Knex;

  protected constructor(
    private readonly tableName: string,
    converter: IModelEntityConverter<TModel, TEntity>
  ) {
    this.converter = {
      toEntity: model => removeUndefined(converter.toEntity(model)),
      toModel: entity => converter.toModel(entity)
    };

    this.knexInstance = Knex(knexConfig);
  }

  public async insert(data: Partial<TModel> | Partial<TModel>[]): Promise<number> {
    const entity =
      data instanceof Array
        ? data.map(d => this.converter.toEntity(d))
        : this.converter.toEntity(data);

    // make sure we don't try to insert id
    const entityWithoutId =
      entity instanceof Array ? entity.map(e => this.removeId(e)) : this.removeId(entity);

    return (
      this.knex
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(entityWithoutId as any)
        .then(id => id[0])
    );
  }

  public async select(where?: Partial<TModel>): Promise<TModel[]>;
  public async select(where: Partial<TModel>, unique: true): Promise<TModel>;
  public async select(
    where?: Partial<TModel>,
    unique?: true
  ): Promise<TModel | TModel[]> {
    if (!where) {
      // get()
      return this.knex
        .then(res => res as TEntity[])
        .then(entities => entities.map(e => this.converter.toModel(e)));
    }

    if (unique) {
      // get(where, unique)
      return this.knex
        .where(this.converter.toEntity(where))
        .first()
        .then(res => this.converter.toModel(res as TEntity));
    }

    // get(where)
    return this.knex
      .where(this.converter.toEntity(where))
      .then(res => res as TEntity[])
      .then(entities => entities.map(e => this.converter.toModel(e)));
  }

  public async count(
    where?: Partial<TModel>,
    columnName?: keyof TEntity | '*'
  ): Promise<number> {
    return this.knex
      .where(this.converter.toEntity(where || {}))
      .count({ count: columnName || 'id' })
      .then(res => res[0].count);
  }

  public async exists(where?: Partial<TModel>): Promise<boolean> {
    // NOTE: use EXISTS query?
    return this.count(where).then(count => count > 0);
  }

  public async update(where: Partial<TModel>, data: Partial<TModel>): Promise<void> {
    // make sure we don't try to update id
    const entityWithoutId = this.removeId(this.converter.toEntity(data));

    return (
      this.knex
        .where(this.converter.toEntity(where))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update(entityWithoutId as any)
    );
  }

  public async delete(where: Partial<TModel>): Promise<void> {
    return this.knex.where(this.converter.toEntity(where)).del();
  }

  protected get knex() {
    return this.knexInstance<TEntity>(this.tableName);
  }

  private removeId(obj: Partial<TEntity>): Omit<Partial<TEntity>, 'id'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = obj;
    return rest;
  }
}

function removeUndefined<T>(obj: T): T {
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
  return obj;
}
