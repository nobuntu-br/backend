export interface IDatabaseAdapter<T> {
  create(data: Object): Promise<T>;
  findAll(limitPerPage: number, offset: number): Promise<T[] | null>;
  findOne(query: Object): Promise<T | null>;
  findMany(query: Object): Promise<T[] | null>;
  findById(id: string): Promise<T | null>;
  getCount(): Promise<number | null>;
  update(id: string, data: Object): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  deleteAll(): Promise<void>;
  findCustom(query: any): Promise<T[] | null>;
}
