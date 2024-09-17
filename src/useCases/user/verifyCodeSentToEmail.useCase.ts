import { NotFoundError } from "../../errors/notFound.error";
import { IVerificationEmail } from "../../models/verificationEmail.model";
import { VerificationEmailService } from "../../services/verificationEmail.service";

export class VerifyCodeSendToEmailUseCase {
  constructor(
    private verificationEmailService: VerificationEmailService
  ) {

  }

  async execute(email: string, verificationEmailCode: string): Promise<boolean> {

    try {
      //Encontrar o código de email que foi enviado para o email do usuário
      const verificationEmailCodeExists: IVerificationEmail | null = await this.verificationEmailService.findOne({
        email: email,
        verificationCode: verificationEmailCode
      });

      if (verificationEmailCodeExists == null) {
        throw new NotFoundError("Código de verifciação de email não encontrado!");
      }

      if (!verificationEmailCodeExists.id) {
        throw new NotFoundError("ID do código de verificação de email não encontrado!");
      }

      //Remove o código que foi já utilizado
      await this.verificationEmailService.delete(verificationEmailCodeExists.id);

      return true;
    } catch (error) {
      throw new NotFoundError("Erro na validação do código para verificar email. " + error);
    }
  }
}