
import { FilterValue } from "../utils/mongoose/customQuery.util";

//Interface com as funcionalidades dos bancos de dados
export interface IDatabaseAdapter<T> {
  readonly model: any;
  readonly databaseType: string;
  create(data: any): Promise<T>;
  findAll(limitPerPage: number, offset: number): Promise<T[]>;
  findOne(query: T): Promise<T>;
  findMany(query: T): Promise<T[]>;
  findById(id: string): Promise<T>;
  getCount(): Promise<number>;
  update(id: string, data: Object): Promise<T>;
  delete(id: string): Promise<T>;
  deleteAll(): Promise<void>;
  findCustom(filterValues: FilterValue[], filterConditions: string[], model: any): Promise<T[] | null>;
  findUsingCustomQuery(query: any): Promise<T[]>;
}
