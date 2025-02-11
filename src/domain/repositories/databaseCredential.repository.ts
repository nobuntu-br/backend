import { createDbAdapter } from "../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../infra/database/IDatabase.adapter";
import { IDatabaseCredentialDatabaseModel, DatabaseCredential } from "../entities/databaseCredential.model";
import TenantConnection from "../entities/tenantConnection.model";
import BaseRepository from "./base.repository";
import { DatabaseCredentialRepositoryMongoose } from "../../infra/database/mongoose/repositories/databaseCredential.repository";
import { DatabaseCredentialRepositorySequelize } from "../../infra/database/sequelize/repositories/databaseCredential.repository";

export interface IDatabaseCredentialRepository {
  getDatabaseCredentialByTenantId(tenantId: number, ownerUserId: number): Promise<DatabaseCredential[]>;
}

export default class DatabaseCredentialRepository extends BaseRepository<IDatabaseCredentialDatabaseModel, DatabaseCredential> {
  advancedSearches: IDatabaseCredentialRepository;

  constructor(tenantConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<IDatabaseCredentialDatabaseModel, DatabaseCredential> = createDbAdapter<IDatabaseCredentialDatabaseModel, DatabaseCredential>(tenantConnection.models!.get("DatabaseCredential"), tenantConnection.databaseType, tenantConnection.connection, DatabaseCredential.fromJson);
    super(_adapter, tenantConnection);

    if (tenantConnection.databaseType === 'mongodb') {
      this.advancedSearches = new DatabaseCredentialRepositoryMongoose(this.tenantConnection, this.adapter);
    } else {
      this.advancedSearches = new DatabaseCredentialRepositorySequelize(this.tenantConnection, this.adapter);
    }
  }

}