import { DatabaseType } from "../adapters/createDb.adapter";
import { DatabaseCredential } from "../models/databaseCredential.model";
import DatabaseCredentialRepository from "../repositories/databaseCredential.repository";
import BaseService from "./base.service";

export class DatabaseCredentialService extends BaseService<DatabaseCredential> {
  private tenantCredentialRepository: DatabaseCredentialRepository;

  constructor(databaseType: DatabaseType, databaseConnection: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository : DatabaseCredentialRepository = new DatabaseCredentialRepository(databaseType, databaseConnection);
    super(repository, databaseType, databaseConnection);

    this.tenantCredentialRepository = repository;
  }

}