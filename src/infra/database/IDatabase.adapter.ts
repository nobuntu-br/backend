
import { ClientSession, Connection } from "mongoose";
import { FilterValue } from "../../utils/mongoose/customQuery.util";
import { Sequelize, Transaction } from "sequelize";
import { DatabaseType } from "./createDb.adapter";

//Interface com as funcionalidades dos bancos de dados
export interface IDatabaseAdapter<TInterface, TClass> {
  readonly model: any;
  readonly databaseType: string;
  readonly databaseConnection: Connection | Sequelize;

  //Lazy loading
  create(data: TInterface): Promise<TClass>;
  findAll(limitPerPage: number, offset: number): Promise<TClass[]>;
  findOne(query: TInterface): Promise<TClass | null>;
  findMany(query: TInterface): Promise<TInterface[]>;
  findById(id: number): Promise<TClass | null>;
  getCount(): Promise<number>;
  update(id: number, data: Object): Promise<TClass | null>;
  delete(id: number): Promise<TClass | null>;
  deleteAll(): Promise<void>;
  executeQuery(query: string): Promise<Object>;
  findCustom(filterValues: FilterValue[], filterConditions: string[], model: any): Promise<TClass[] | null>;
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
  findOneWithEagerLoading(query: TInterface): Promise<TClass | null>;
  findManyWithEagerLoading(query: TInterface): Promise<TClass[]>;
  findByIdWithEagerLoading(id: number): Promise<TClass | null>;

  }
