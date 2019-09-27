export interface IDbRepository<T> {
  createTable(): Promise<void>;
  create(entity: T): Promise<void>;
  getAll(): Promise<T[]>;
  get(id: number): Promise<T>;
  update?(id: number, entity: T): void;
}
