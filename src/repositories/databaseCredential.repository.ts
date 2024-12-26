import createDbAdapter from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { DatabaseCredential, IDatabaseCredentialDatabaseModel } from "../models/databaseCredential.model";
import TenantConnection from "../models/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class DatabaseCredentialRepository extends BaseRepository<IDatabaseCredentialDatabaseModel, DatabaseCredential>{

  constructor(tenantConnection: TenantConnection){
    const _adapter : IDatabaseAdapter<IDatabaseCredentialDatabaseModel, DatabaseCredential> = createDbAdapter<IDatabaseCredentialDatabaseModel, DatabaseCredential>(tenantConnection.models!.get("DatabaseCredential"), tenantConnection.databaseType, tenantConnection.connection, DatabaseCredential.fromJson);
    super(_adapter, tenantConnection);
  }

}