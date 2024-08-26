import createDbAdapter, { DbType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { UserTenant } from "../models/userTenant.model";
import BaseRepository from "./base.repository";

export default class UserTenantRepository extends BaseRepository<UserTenant>{

  constructor(dbType: DbType, model: any){
    const _adapter : IDatabaseAdapter<UserTenant> = createDbAdapter<UserTenant>(dbType, model, UserTenant.fromJson)
    super(_adapter);
  }

}