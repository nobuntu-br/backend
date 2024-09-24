import createDbAdapter, { DbType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { VerificationEmail } from "../models/verificationEmail.model";
import BaseRepository from "./base.repository";

export default class VerificationEmailRepository extends BaseRepository<VerificationEmail>{

  constructor(dbType: DbType, model: any, databaseConnection: any){
    const _adapter : IDatabaseAdapter<VerificationEmail> = createDbAdapter<VerificationEmail>(dbType, model, VerificationEmail.fromJson);
    super(_adapter, databaseConnection);
  }

}