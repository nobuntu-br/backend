import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { FilterValue } from "../utils/mongoose/customQuery.util";
import { IBaseRepository } from "./ibase.repository";

export default abstract class BaseRepository<TInterface, TClass> implements IBaseRepository<TInterface, TClass>{
  public adapter: IDatabaseAdapter<TInterface, TClass>;
  public databaseConnection: any;

  constructor(adapter: IDatabaseAdapter<TInterface, TClass>, databaseConnection: any){
    this.adapter = adapter;
    this.databaseConnection = databaseConnection;
  }

  create(data: TClass): Promise<TClass> {
    return this.adapter.create(data);
  }

  findAll(limitPerPage: number, offset: number): Promise<TClass[]> {
    return this.adapter.findAll(limitPerPage, offset);
  }

  findOne(query: TInterface): Promise<TClass> {
    return this.adapter.findOne(query);
  }

  findMany(query: TInterface): Promise<TClass[]> {
    return this.adapter.findMany(query);
  }

  findById(id: number): Promise<TClass> {
    return this.adapter.findById(id);
  }

  getCount(): Promise<number> {
    return this.adapter.getCount();
  }

  update(id: number, data: Object): Promise<TClass> {
    return this.adapter.update(id, data);
  }

  delete(id: number): Promise<TClass> {
    return this.adapter.delete(id);
  }

  deleteAll(): Promise<void> {
    return this.adapter.deleteAll();
  }

  findCustom(filterValues: FilterValue[], filterConditions: string[], model: any): Promise<TClass[] | null>{
    return this.adapter.findCustom(filterValues, filterConditions, model);
  }

  findUsingCustomQuery(query: any): Promise<TClass[]>{
    return this.adapter.findUsingCustomQuery(query);
  }

}