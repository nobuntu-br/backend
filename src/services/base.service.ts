import { DbType } from "../adapters/createDb.adapter";
import { IBaseRepository } from "../repository/ibase.repository";
import { IBaseService } from "./IBase.service";

export default class BaseService<T> implements IBaseService<T> {
  dbType: DbType;
  model: any;
  repository: IBaseRepository<T>;
  databaseConnection: any;

  /**
   * 
   * @param repository Interface do repository com base no modelo usado
   * @param dbType Tipo de banco de dados que foi feito a conexão
   * @param model Modelo
   * @param databaseConnection Instância da conexão com banco de dados 
   */
  constructor(repository: IBaseRepository<T>, dbType: DbType, model: any, databaseConnection: any) {
    this.repository = repository;
    this.dbType = dbType;
    this.model = model;
    this.databaseConnection = databaseConnection;
  }

  create(data: T): Promise<T> {
    return this.repository.create(data);
  }

  findAll(limitPerPage: number, offset: number): Promise<T[] | null> {
    return this.repository.findAll(limitPerPage, offset);
  }

  findOne(query: T): Promise<T | null> {
    return this.repository.findOne(query);
  }

  findMany(query: T): Promise<T[] | null> {
    return this.repository.findMany(query);
  }

  findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  getCount(): Promise<number | null> {
    return this.repository.getCount();
  }
  
  update(id: string, data: Object): Promise<T | null> {
    return this.repository.update(id, data);
  }

  delete(id: string): Promise<T | null> {
    return this.repository.delete(id);
  }

  deleteAll(): Promise<void> {
    return this.repository.deleteAll();    
  }

}