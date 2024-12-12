import createDbAdapter from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { ITenantDatabaseModel, Tenant } from "../models/tenant.model";
import TenantConnection from "../models/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class TenantRepository extends BaseRepository<ITenantDatabaseModel, Tenant>{

  constructor(tenantConnection: TenantConnection){
    const _adapter : IDatabaseAdapter<ITenantDatabaseModel, Tenant> = createDbAdapter<ITenantDatabaseModel, Tenant>(tenantConnection.models!.get("Tenant"), tenantConnection.databaseType, tenantConnection.connection, Tenant.fromJson);
    super(_adapter, tenantConnection);
  }

}