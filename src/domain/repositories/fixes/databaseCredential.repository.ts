import { createDbAdapter } from "../../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../../infra/database/IDatabase.adapter";
import BaseRepository from "./base.repository";
import { DatabaseCredentialRepositoryMongoose } from "../../../infra/database/mongoose/repositories/databaseCredential.repository";
import { DatabaseCredentialRepositorySequelize } from "../../../infra/database/sequelize/repositories/databaseCredential.repository";
import { DatabaseCredential, IDatabaseCredentialDatabaseModel } from "../../entities/fixes/databaseCredential.model";
import TenantConnection from "../../entities/fixes/tenantConnection.model";

export interface IDatabaseCredentialRepository {
  getDatabaseCredentialByTenantId(tenantId: number, ownerUserId: number): Promise<DatabaseCredential[]>;
}

export default class DatabaseCredentialRepository extends BaseRepository<IDatabaseCredentialDatabaseModel, DatabaseCredential> {
  advancedSearches: IDatabaseCredentialRepository;

  constructor(tenantConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<IDatabaseCredentialDatabaseModel, DatabaseCredential> = createDbAdapter<IDatabaseCredentialDatabaseModel, DatabaseCredential>(tenantConnection.models!.get("nfDatabaseCredential"), tenantConnection.databaseType, tenantConnection.connection, DatabaseCredential.fromJson);
    super(_adapter, tenantConnection);

    if (tenantConnection.databaseType === 'mongodb') {
      this.advancedSearches = new DatabaseCredentialRepositoryMongoose(this.tenantConnection, this.adapter);
    } else {
      this.advancedSearches = new DatabaseCredentialRepositorySequelize(this.tenantConnection, this.adapter);
    }
  }

}