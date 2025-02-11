import { DatabaseCredential, IDatabaseCredentialDatabaseModel } from "../../../../domain/entities/databaseCredential.model";
import TenantConnection from "../../../../domain/entities/tenantConnection.model";
import { IDatabaseCredentialRepository } from "../../../../domain/repositories/databaseCredential.repository";
import { IDatabaseAdapter } from "../../IDatabase.adapter";

export class DatabaseCredentialRepositoryMongoose implements IDatabaseCredentialRepository {
  constructor(private tenantConnection: TenantConnection, private adapter: IDatabaseAdapter<IDatabaseCredentialDatabaseModel, DatabaseCredential>) {}
  
  getDatabaseCredentialByTenantId(tenantId: number): Promise<DatabaseCredential[]> {
    throw new Error("Method not implemented.");
  }

}
