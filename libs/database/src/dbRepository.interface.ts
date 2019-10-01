export interface IDbRepository<T> {
  create(entity: Partial<T> | Partial<T>[]): Promise<number>;

  get(): Promise<T[]>;
  get(where: Partial<T>): Promise<T[]>;
  get(where: Partial<T>, unique: true): Promise<T>;

  update(where: Partial<T>, data: Partial<T>): Promise<void>;
}
