import { DatabaseType } from "../adapters/createDb.adapter";
import { IVerificationEmail, VerificationEmail } from "../models/verificationEmail.model";
import VerificationEmailRepository from "../repositories/verificationEmail.repository";
import BaseService from "./base.service";

export class VerificationEmailService extends BaseService<IVerificationEmail, VerificationEmail> {
  private verificationEmailRepository: VerificationEmailRepository;

  constructor(databaseType: DatabaseType, databaseConnection: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository: VerificationEmailRepository = new VerificationEmailRepository(databaseType, databaseConnection);
    super(repository, databaseType, databaseConnection);
    
    this.verificationEmailRepository = repository;
  }

  async ifEmailWasValidated(email: string): Promise<boolean> {
    try {
      const validatedEmail: IVerificationEmail | null = await this.verificationEmailRepository.findOne({ email: email });

      if (validatedEmail != null && validatedEmail.isVerified == true) {
        return true;
      }

      return false;
    } catch (error) {
      throw error;
    }
  }

  async checkIfExpired(email: string, date: Date): Promise<boolean> {
    try {
      const emailVerificationCode: IVerificationEmail | null = await this.verificationEmailRepository.findOne({ email: email });

      if(emailVerificationCode == null){
        throw new Error("Não existe código de verificação enviado para esse email");
      }

      if(date.getTime() > emailVerificationCode.expirationDate!.getTime()){
        return true;
      }

      return false;
    } catch (error) {
      throw new Error("Erro ao verificar se o código de verificação de email está valido");
    }
  }

}