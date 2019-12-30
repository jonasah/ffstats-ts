export interface IDbRepository<TModel, TEntity> {
  insert(data: Partial<TModel> | Partial<TModel>[]): Promise<number>;

  select(where?: Partial<TModel>): Promise<TModel[]>;
  select(where: Partial<TModel>, unique: true): Promise<TModel>;

  count(where?: Partial<TModel>, columnName?: keyof TEntity | '*'): Promise<number>;
  exists(where?: Partial<TModel>): Promise<boolean>;

  update(where: Partial<TModel>, data: Partial<TModel>): Promise<void>;

  delete(where: Partial<TModel>): Promise<void>;
}
