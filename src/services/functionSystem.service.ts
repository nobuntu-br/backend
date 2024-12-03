import { DatabaseType } from "../adapters/createDb.adapter";
import { FunctionSystem, IFunctionSystem } from "../models/functionSystem.model";
import FunctionSystemRepository from "../repositories/functionSystem.repository";
import BaseService from "./base.service";

export class FunctionSystemService extends BaseService<IFunctionSystem, FunctionSystem> {
  private functionSystemRepository: FunctionSystemRepository;

  constructor(databaseType: DatabaseType, databaseConnection: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository: FunctionSystemRepository = new FunctionSystemRepository(databaseType, databaseConnection);
    super(repository, databaseType, databaseConnection);

    this.functionSystemRepository = repository;
  }

  

}