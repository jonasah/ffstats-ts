export interface IDbRepository<T> {
  create(entity: Partial<T> | Partial<T>[]): Promise<number>;

  get(): Promise<T[]>;
  get(id: number): Promise<T>;
  get(column: string, value: any): Promise<T[]>;
  get(column: string, value: any, unique: true): Promise<T>;
}
