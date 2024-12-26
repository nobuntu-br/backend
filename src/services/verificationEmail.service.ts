import TenantConnection from "../models/tenantConnection.model";
import { IVerificationEmailDatabaseModel, VerificationEmail } from "../models/verificationEmail.model";
import VerificationEmailRepository from "../repositories/verificationEmail.repository";
import BaseService from "./base.service";

export class VerificationEmailService extends BaseService<IVerificationEmailDatabaseModel, VerificationEmail> {
  private verificationEmailRepository: VerificationEmailRepository;

  constructor(tenantConnection: TenantConnection) {
    //Cria o repositório com dados para obter o banco de dados
    let repository: VerificationEmailRepository = new VerificationEmailRepository(tenantConnection);
    super(repository, tenantConnection);

    this.verificationEmailRepository = repository;

  }

  async ifEmailWasValidated(email: string): Promise<boolean> {
    return this.verificationEmailRepository.ifEmailWasValidated(email);
  }

  async checkIfExpired(email: string): Promise<boolean> {
    try {
      return this.verificationEmailRepository.checkIfExpired(email);
    } catch (error) {
      throw new Error("Erro ao verificar se o código de verificação de email está valido");
    }
  }

}