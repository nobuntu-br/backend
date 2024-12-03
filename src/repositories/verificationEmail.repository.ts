import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { IVerificationEmail, VerificationEmail } from "../models/verificationEmail.model";
import BaseRepository from "./base.repository";

export default class VerificationEmailRepository extends BaseRepository<IVerificationEmail, VerificationEmail>{

  constructor(databaseType: DatabaseType, databaseConnection: any){
    const _adapter : IDatabaseAdapter<IVerificationEmail, VerificationEmail> = createDbAdapter<IVerificationEmail, VerificationEmail>(databaseType, databaseConnection.models["VerificationEmail"], VerificationEmail.fromJson);
    super(_adapter, databaseConnection);
  }

}