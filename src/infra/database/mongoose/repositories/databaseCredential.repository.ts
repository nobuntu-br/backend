import { DatabaseCredential, IDatabaseCredentialDatabaseModel } from "../../../../domain/entities/fixes/databaseCredential.model";
import TenantConnection from "../../../../domain/entities/fixes/tenantConnection.model";
import { IDatabaseCredentialRepository } from "../../../../domain/repositories/fixes/databaseCredential.repository";
import { IDatabaseAdapter } from "../../IDatabase.adapter";

export class DatabaseCredentialRepositoryMongoose implements IDatabaseCredentialRepository {
  constructor(private tenantConnection: TenantConnection, private adapter: IDatabaseAdapter<IDatabaseCredentialDatabaseModel, DatabaseCredential>) {}
  
  getDatabaseCredentialByTenantId(tenantId: number): Promise<DatabaseCredential[]> {
    throw new Error("Method not implemented.");
  }

}
