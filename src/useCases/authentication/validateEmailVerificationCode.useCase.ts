import { IVerificationEmail } from "../../domain/entities/verificationEmail.model";
import VerificationEmailRepository from "../../domain/repositories/verificationEmail.repository";
import { NotFoundError } from "../../errors/notFound.error";

export type ValidateEmailVerificationCodeInputDTO = {
  verificationEmailCode: string;
}

export class ValidateEmailVerificationCodeUseCase {
  constructor(
    private verificationEmailRepository: VerificationEmailRepository 
  ) {}

  async execute(input: ValidateEmailVerificationCodeInputDTO): Promise<boolean> {

    try {
      //Encontrar o código de email que foi enviado para o email do usuário
      const verificationEmailCodeExists: IVerificationEmail | null = await this.verificationEmailRepository.findOne({
        verificationCode: input.verificationEmailCode,
      });

      if (verificationEmailCodeExists == null) {
        throw new NotFoundError("Código de verificação de email não encontrado!");
      }

      if (!verificationEmailCodeExists.id) {
        throw new NotFoundError("ID do código de verificação de email não encontrado!");
      }

      const currentTime: Date = new Date();

      if(currentTime.getTime() > verificationEmailCodeExists.expirationDate!.getTime()){
        throw new Error("A data atual já passou do tempo de expiração");
      }

      if(verificationEmailCodeExists.isVerified == true){
        return true;
      } else {
        verificationEmailCodeExists.isVerified = true;
        await this.verificationEmailRepository.update(verificationEmailCodeExists.id, verificationEmailCodeExists);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
}