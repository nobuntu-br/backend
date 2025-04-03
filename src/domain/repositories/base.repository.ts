import { ClientSession } from "mongoose";
import { Transaction } from "sequelize";
import { IBaseRepository } from "./ibase.repository";
import { IDatabaseAdapter } from "../../infra/database/IDatabase.adapter";
import { FilterValue } from "../../utils/mongoose/customQuery.util";
import TenantConnection from "../entities/tenantConnection.model";

export default abstract class BaseRepository<TInterface, TClass> implements IBaseRepository<TInterface, TClass>{
  public adapter: IDatabaseAdapter<TInterface, TClass>;
  public _tenantConnection: TenantConnection;

  constructor(adapter: IDatabaseAdapter<TInterface, TClass>, tenantConnection: TenantConnection){
    this.adapter = adapter;
    this._tenantConnection = tenantConnection;
  }

  get tenantConnection(){
    return this._tenantConnection;
  }
  
  create(data: TInterface): Promise<TClass> {
    return this.adapter.create(data);
  }

  findAll(pageSize: number, page: number): Promise<TClass[]> {
    return this.adapter.findAll(pageSize, page);
  }

  findOne(query: TInterface): Promise<TClass | null> {
    return this.adapter.findOne(query);
  }

  findMany(query: TInterface, pageSize: number, page: number): Promise<TInterface[]> {
    return this.adapter.findMany(query, pageSize, page);
  }

  findById(id: number): Promise<TClass | null> {
    return this.adapter.findById(id);
  }

  getCount(): Promise<number> {
    return this.adapter.getCount();
  }

  update(id: number, data: Object): Promise<TClass | null> {
    return this.adapter.update(id, data);
  }

  delete(id: number): Promise<TClass | null> {
    return this.adapter.delete(id);
  }

  deleteAll(): Promise<void> {
    return this.adapter.deleteAll();
  }

  executeQuery(query: string): Promise<Object> {
    return this.adapter.executeQuery(query);
  }

  findCustom(filterValues: FilterValue[], filterConditions: string[], model: any): Promise<TClass[] | null>{
    return this.adapter.findCustom(filterValues, filterConditions, model);
  }

  findUsingCustomQuery(query: any): Promise<TClass[]>{
    return this.adapter.findUsingCustomQuery(query);
  }
  
  startTransaction(): Promise<any> {
    return this.adapter.startTransaction();
  }

  commitTransaction(transaction: ClientSession | Transaction): Promise<void> {
    return this.adapter.commitTransaction(transaction);
  }

  rollbackTransaction(transaction: ClientSession | Transaction): Promise<void> {
    return this.adapter.commitTransaction(transaction);
  }

  createWithTransaction(data: TInterface, transaction: ClientSession | Transaction): Promise<TClass> {
    return this.adapter.createWithTransaction(data, transaction);
  }

  updateWithTransaction(id: number, data: Object, transaction: ClientSession | Transaction): Promise<TClass> {
    return this.adapter.updateWithTransaction(id, data, transaction);
  }

  deleteWithTransaction(id: number, transaction: ClientSession | Transaction): Promise<TClass> {
    return this.adapter.deleteWithTransaction(id, transaction);
  }

  findAllWithAagerLoading(pageSize: number, page: number): Promise<TClass[]> {
    return this.adapter.findAllWithAagerLoading(pageSize, page);
  }

  findOneWithEagerLoading(query: TInterface): Promise<TClass | null> {
    return this.adapter.findOneWithEagerLoading(query);
  }

  findManyWithEagerLoading(query: TInterface, pageSize: number, page: number): Promise<TClass[]> {
    return this.adapter.findManyWithEagerLoading(query, pageSize, page);
  }

  findByIdWithEagerLoading(id: number): Promise<TClass | null> {
    return this.adapter.findByIdWithEagerLoading(id);
  }

}