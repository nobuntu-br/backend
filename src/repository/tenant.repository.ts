import createDbAdapter, { DbType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { Tenant } from "../models/tenant.model";
import BaseRepository from "./base.repository";

export default class TenantRepository extends BaseRepository<Tenant>{

  constructor(dbType: DbType, model: any){
    const _adapter : IDatabaseAdapter<Tenant> = createDbAdapter<Tenant>(dbType, model, Tenant.fromJson)
    super(_adapter);
  }

}