import { DbType } from "../adapters/createDb.adapter";
import { FunctionSystem } from "../models/functionSystem.model";
import FunctionSystemRepository from "../repository/functionSystem.repository";
import BaseService from "./base.service";

export class FunctionSystemService extends BaseService<FunctionSystem> {
  private functionSystemRepository: FunctionSystemRepository;

  constructor(dbType: DbType, model: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository: FunctionSystemRepository = new FunctionSystemRepository(dbType, model);
    super(repository, dbType, model);

    this.functionSystemRepository = repository;
  }

  async isPublicRoute(method: string, url: string): Promise<boolean> {
    try {
      return await this.functionSystemRepository.isPublicRoute(method, url, this.dbType);
    } catch (error) {
      throw new Error("Erro no método de verificação se a rota é pública")
    }
  }

}