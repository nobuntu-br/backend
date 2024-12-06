import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import TenantConnection from "../models/tenantConnection.model";
import { IVerificationEmailDatabaseModel, VerificationEmail } from "../models/verificationEmail.model";
import BaseRepository from "./base.repository";

export default class VerificationEmailRepository extends BaseRepository<IVerificationEmailDatabaseModel, VerificationEmail>{

  constructor(databaseType: DatabaseType, tenantConnection: TenantConnection){
    const _adapter : IDatabaseAdapter<IVerificationEmailDatabaseModel, VerificationEmail> = createDbAdapter<IVerificationEmailDatabaseModel, VerificationEmail>(tenantConnection.models!.get("VerificationEmail"), databaseType, tenantConnection.connection, VerificationEmail.fromJson);
    super(_adapter, tenantConnection);
  }

}