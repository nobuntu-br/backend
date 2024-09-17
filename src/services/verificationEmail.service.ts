import { DbType } from "../adapters/createDb.adapter";
import { IVerificationEmail } from "../models/verificationEmail.model";
import VerificationEmailRepository from "../repository/verificationEmail.repository";
import BaseService from "./base.service";

export class VerificationEmailService extends BaseService<IVerificationEmail> {
  private verificationEmailRepository: VerificationEmailRepository;

  constructor(dbType: DbType, model: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository: VerificationEmailRepository = new VerificationEmailRepository(dbType, model);
    super(repository, dbType, model);
    
    this.verificationEmailRepository = repository;
  }

}