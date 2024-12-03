
import { FilterValue } from "../utils/mongoose/customQuery.util";

//Interface com as funcionalidades dos bancos de dados
export interface IDatabaseAdapter<TInterface, TClass> {
  readonly model: any;
  readonly databaseType: string;
  create(data: TClass): Promise<TClass>;
  findAll(limitPerPage: number, offset: number): Promise<TClass[]>;
  findOne(query: TInterface): Promise<TClass>;
  findMany(query: TInterface): Promise<TClass[]>;
  findById(id: number): Promise<TClass>;
  getCount(): Promise<number>;
  update(id: number, data: Object): Promise<TClass>;
  delete(id: number): Promise<TClass>;
  deleteAll(): Promise<void>;
  findCustom(filterValues: FilterValue[], filterConditions: string[], model: any): Promise<TClass[] | null>;
  findUsingCustomQuery(query: any): Promise<TClass[]>;
}
