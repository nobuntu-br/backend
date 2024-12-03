import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { ITenant, Tenant } from "../models/tenant.model";
import BaseRepository from "./base.repository";

export default class TenantRepository extends BaseRepository<ITenant, Tenant>{

  constructor(dbType: DatabaseType, databaseConnection: any){
    const _adapter : IDatabaseAdapter<ITenant, Tenant> = createDbAdapter<ITenant, Tenant>(dbType, databaseConnection.models["Tenant"], Tenant.fromJson);
    super(_adapter, databaseConnection);
  }

}