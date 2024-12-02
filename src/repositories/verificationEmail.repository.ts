import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { VerificationEmail } from "../models/verificationEmail.model";
import BaseRepository from "./base.repository";

export default class VerificationEmailRepository extends BaseRepository<VerificationEmail>{

  constructor(databaseType: DatabaseType, databaseConnection: any){
    const _adapter : IDatabaseAdapter<VerificationEmail> = createDbAdapter<VerificationEmail>(databaseType, databaseConnection.models["VerificationEmail"], VerificationEmail.fromJson);
    super(_adapter, databaseConnection);
  }

}