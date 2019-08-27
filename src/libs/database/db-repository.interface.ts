export interface DbRepository<T> {
  createTable(): void;
  create(entity: T): void;
  get(id: number): Promise<T>;
  all(): Promise<T[]>;
  update?(id: number, entity: T): void;
}
