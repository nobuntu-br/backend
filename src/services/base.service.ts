import { DatabaseType } from "../adapters/createDb.adapter";
import { IBaseRepository } from "../repositories/ibase.repository";
import { IBaseService } from "./IBase.service";

export default class BaseService<TInterface, TClass> implements IBaseService<TInterface, TClass> {
  databaseType: DatabaseType;
  repository: IBaseRepository<TInterface, TClass>;
  databaseConnection: any;

  /**
   * @param databaseConnection Instância da conexão com banco de dados 
   */
  constructor(repository: IBaseRepository<TInterface, TClass>, databaseType: DatabaseType, databaseConnection: any) {
    this.repository = repository;
    this.databaseType = databaseType;
    this.databaseConnection = databaseConnection;
  }

  create(data: TClass): Promise<TClass> {
    return this.repository.create(data);
  }

  findAll(limitPerPage: number, offset: number): Promise<TClass[] | null> {
    return this.repository.findAll(limitPerPage, offset);
  }

  findOne(query: TInterface): Promise<TClass> {
    return this.repository.findOne(query);
  }

  findMany(query: TInterface): Promise<TClass[]> {
    return this.repository.findMany(query);
  }

  findById(id: number): Promise<TClass> {
    return this.repository.findById(id);
  }

  getCount(): Promise<number> {
    return this.repository.getCount();
  }
  
  update(id: number, data: Object): Promise<TClass | null> {
    return this.repository.update(id, data);
  }

  delete(id: number): Promise<TClass | null> {
    return this.repository.delete(id);
  }

  deleteAll(): Promise<void> {
    return this.repository.deleteAll();    
  }

  findCustom(filterValues: any[], filterConditions: string[], model: any): Promise<TClass[] | null> {
    return this.repository.findCustom(filterValues, filterConditions, model);
  }

}