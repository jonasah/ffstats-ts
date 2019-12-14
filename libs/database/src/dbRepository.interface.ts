export interface IDbRepository<T> {
  insert(entity: Partial<T> | Partial<T>[]): Promise<number>;

  select(where?: Partial<T>): Promise<T[]>;
  select(where: Partial<T>, unique: true): Promise<T>;

  count(where?: Partial<T>, columnName?: keyof T | '*'): Promise<number>;

  update(where: Partial<T>, data: Partial<T>): Promise<void>;

  delete(where: Partial<T>): Promise<void>;
}
