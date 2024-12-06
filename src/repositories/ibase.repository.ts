import { ClientSession, Model } from "mongoose";
import { FilterValue } from "../utils/mongoose/customQuery.util";
import { ModelStatic, Transaction } from "sequelize";

export interface IBaseRepository<TInterface, TClass> {
  create(data: TClass): Promise<TClass>;
  findAll(limitPerPage: number, offset: number): Promise<TClass[]>;
  findOne(query: TInterface): Promise<TClass>;
  findMany(query: TInterface): Promise<TClass[]>;
  findById(id: number): Promise<TClass>;
  getCount(): Promise<number>;
  update(id: number, data: Object): Promise<TClass>;
  delete(id: number): Promise<TClass>;
  deleteAll(): Promise<void>;
  findCustom(filterValues: FilterValue[], filterConditions: string[], model: Model<any> | ModelStatic<any>): Promise<TClass[] | null>;
  findUsingCustomQuery(query: any): Promise<TClass[]>;
  //Transações

  startTransaction(): Promise<any>; //irá chamar a instância do banco de dados para operar as transações com query pura no repository
  commitTransaction(transaction : ClientSession | Transaction): Promise<void>;
  rollbackTransaction(transaction : ClientSession | Transaction): Promise<void>;
  //Caso o banco de dados ou biblioteca não tenha os métodos acima pra implementar, no UseCase tratar de reverter no "catch"
  
  createWithTransaction(data: TInterface, transaction: ClientSession | Transaction): Promise<TClass>;
  updateWithTransaction(id: number, data: Object, transaction: ClientSession | Transaction): Promise<TClass>;
  deleteWithTransaction(id: number, transaction: ClientSession | Transaction): Promise<TClass>;
  
  //Eager Loading (busca com dados das entidades relacionadas)
  findAllWithAagerLoading(limitPerPage: number, offset: number): Promise<TClass[]>;//funções que já buscam com tudo (sequelize é include, mongoose nem lembro)
  findOneWithEagerLoading(query: TInterface): Promise<TClass>;
  findManyWithEagerLoading(query: TInterface): Promise<TClass[]>;
  findByIdWithEagerLoading(id: number): Promise<TClass>;

}
