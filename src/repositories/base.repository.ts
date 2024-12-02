import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { FilterValue } from "../utils/mongoose/customQuery.util";
import { IBaseRepository } from "./ibase.repository";

export default abstract class BaseRepository<T> implements IBaseRepository<T>{
  public adapter: IDatabaseAdapter<T>;
  public databaseConnection: any;

  constructor(adapter: IDatabaseAdapter<T>, databaseConnection: any){
    this.adapter = adapter;
    this.databaseConnection = databaseConnection;
  }

  create(data: T): Promise<T> {
    return this.adapter.create(data);
  }

  findAll(limitPerPage: number, offset: number): Promise<T[]> {
    return this.adapter.findAll(limitPerPage, offset);
  }

  findOne(query: T): Promise<T> {
    return this.adapter.findOne(query);
  }

  findMany(query: T): Promise<T[]> {
    return this.adapter.findMany(query);
  }

  findById(id: string): Promise<T> {
    return this.adapter.findById(id);
  }

  getCount(): Promise<number> {
    return this.adapter.getCount();
  }

  update(id: string, data: Object): Promise<T> {
    return this.adapter.update(id, data);
  }

  delete(id: string): Promise<T> {
    return this.adapter.delete(id);
  }

  deleteAll(): Promise<void> {
    return this.adapter.deleteAll();
  }

  findCustom(filterValues: FilterValue[], filterConditions: string[], model: any): Promise<T[] | null>{
    return this.adapter.findCustom(filterValues, filterConditions, model);
  }

  findUsingCustomQuery(query: any): Promise<T[]>{
    return this.adapter.findUsingCustomQuery(query);
  }

}