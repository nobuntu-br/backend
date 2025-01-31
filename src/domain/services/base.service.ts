import { DatabaseType } from "../../infra/database/createDb.adapter";
import { NotFoundError } from "../../errors/notFound.error";
import { IBaseRepository } from "../repositories/ibase.repository";
import { IBaseService } from "./IBase.service";
import TenantConnection from "../entities/tenantConnection.model";

export default class BaseService<TInterface, TClass> implements IBaseService<TInterface, TClass> {
  _databaseType: DatabaseType;
  _repository: IBaseRepository<TInterface, TClass>;
  tenantConnection: TenantConnection;

  /**
   * @param databaseConnection Instância da conexão com banco de dados 
   */
  constructor(repository: IBaseRepository<TInterface, TClass>, tenantConnection: TenantConnection) {
    this._repository = repository;
    this._databaseType = tenantConnection.databaseType;
    this.tenantConnection = tenantConnection;
  }

  get databaseType(){
    return this._databaseType;
  }

  get repository(){
    return this._repository;
  }

  create(data: TInterface): Promise<TClass> {
    return this.repository.create(data);
  }

  findAll(limitPerPage: number, offset: number): Promise<TClass[] | null> {
    return this.repository.findAll(limitPerPage, offset);
  }

  async findOne(query: TInterface): Promise<TClass> {
    const returnedValue = await this.repository.findOne(query);

    if(returnedValue == null){
      throw new NotFoundError("Not found data");
    }

    return returnedValue;
  }

  findMany(query: TInterface): Promise<TInterface[]> {
    return this.repository.findMany(query);
  }

  async findById(id: number): Promise<TClass> {
    const returnedValue = await this.repository.findById(id);

    if(returnedValue == null){
      throw new NotFoundError("Not found data");
    }

    return returnedValue;
  }

  getCount(): Promise<number> {
    return this.repository.getCount();
  }
  
  async update(id: number, data: Object): Promise<TClass> {
    const returnedValue = await this.repository.update(id, data);

    if(returnedValue == null){
      throw new NotFoundError("Not found data");
    }

    return returnedValue;
  }

  async delete(id: number): Promise<TClass> {
    const returnedValue = await this.repository.delete(id);

    if(returnedValue == null){
      throw new NotFoundError("Not found data");
    }

    return returnedValue;
  }

  deleteAll(): Promise<void> {
    return this.repository.deleteAll();    
  }

  executeQuery(query: string): Promise<Object> {
    return this.repository.executeQuery(query);
  }

  findCustom(filterValues: any[], filterConditions: string[], model: any): Promise<TClass[] | null> {
    return this.repository.findCustom(filterValues, filterConditions, model);
  }

}