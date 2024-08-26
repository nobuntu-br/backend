import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { IBaseRepository } from "./ibase.repository";

export default abstract class BaseRepository<T> implements IBaseRepository<T>{
  public adapter: IDatabaseAdapter<T>;

  constructor(adapter: IDatabaseAdapter<T>){
    this.adapter = adapter;
  }

  create(data: Object): Promise<T> {
    return this.adapter.create(data);
  }

  findAll(limitPerPage: number, offset: number): Promise<T[] | null> {
    return this.adapter.findAll(limitPerPage, offset);
  }

  findOne(query: Object): Promise<T | null> {
    return this.adapter.findOne(query);
  }

  findMany(query: Object): Promise<T[] | null> {
    return this.adapter.findMany(query);
  }

  findById(id: string): Promise<T | null> {
    return this.adapter.findById(id);
  }

  getCount(): Promise<number | null> {
    return this.adapter.getCount();
  }

  update(id: string, data: Object): Promise<T | null> {
    return this.adapter.update(id, data);
  }

  delete(id: string): Promise<T | null> {
    return this.adapter.delete(id);
  }

  deleteAll(): Promise<void> {
    return this.adapter.deleteAll();
  }

  findCustom(query: any): Promise<T[] | null> {
    return this.adapter.findCustom(query);
  }

}