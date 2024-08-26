import createDbAdapter, { DbType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { TenantCredential } from "../models/tenantCredential.model";
import BaseRepository from "./base.repository";

export default class TenantCredentialRepository extends BaseRepository<TenantCredential>{

  constructor(dbType: DbType, model: any){
    const _adapter : IDatabaseAdapter<TenantCredential> = createDbAdapter<TenantCredential>(dbType, model, TenantCredential.fromJson);
    super(_adapter);
  }

}