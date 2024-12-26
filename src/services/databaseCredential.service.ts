import { DatabaseCredential, IDatabaseCredentialDatabaseModel } from "../models/databaseCredential.model";
import TenantConnection from "../models/tenantConnection.model";
import DatabaseCredentialRepository from "../repositories/databaseCredential.repository";
import BaseService from "./base.service";

export class DatabaseCredentialService extends BaseService<IDatabaseCredentialDatabaseModel, DatabaseCredential> {
  private databaseCredentialRepository: DatabaseCredentialRepository; 

  constructor(tenantConnection: TenantConnection) {
    //Cria o repositório com dados para obter o banco de dados
    let repository: DatabaseCredentialRepository = new DatabaseCredentialRepository(tenantConnection);
    super(repository, tenantConnection);

    this.databaseCredentialRepository = repository;

  }

}