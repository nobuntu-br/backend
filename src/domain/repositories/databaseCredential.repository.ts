import { createDbAdapter } from "../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../infra/database/IDatabase.adapter";
import { IDatabaseCredentialDatabaseModel, DatabaseCredential } from "../entities/databaseCredential.model";
import TenantConnection from "../entities/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class DatabaseCredentialRepository extends BaseRepository<IDatabaseCredentialDatabaseModel, DatabaseCredential>{

  constructor(tenantConnection: TenantConnection){
    const _adapter : IDatabaseAdapter<IDatabaseCredentialDatabaseModel, DatabaseCredential> = createDbAdapter<IDatabaseCredentialDatabaseModel, DatabaseCredential>(tenantConnection.models!.get("DatabaseCredential"), tenantConnection.databaseType, tenantConnection.connection, DatabaseCredential.fromJson);
    super(_adapter, tenantConnection);
  }

}