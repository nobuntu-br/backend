import { EmailService } from '../../domain/services/email.service';
import { TokenGenerator } from '../../utils/tokenGenerator';

export type SendPasswordResetLinkToEmailInputDTO = {
  email: string;
}

export class SendPasswordResetLinkToEmailUseCase {
  constructor(
    private emailService: EmailService,
    private tokenGenerator: TokenGenerator
  ) { }

  async execute(input: SendPasswordResetLinkToEmailInputDTO): Promise<boolean> {

    const applicationName = process.env.APPLICATION_NAME;
    const resetAccountPasswordPath = process.env.RESET_ACCOUNT_PASSWORD_PATH;

    if(applicationName == undefined || applicationName == '' || resetAccountPasswordPath == undefined || resetAccountPasswordPath == ''){
      throw new Error("Dados relacionados a envio de email de alteração de senha da conta não estão preechidos nas variáveis ambiente!");
    }

    const resetPasswordToken : string = this.tokenGenerator.generateToken({email: input.email}, 300000);
    
    try {

      await this.emailService.sendEmail({
        subject: "Recuperação de email do serviço "+process.env.APPLICATION_NAME,
        text: `Para alterar a senha da sua conta faça o acesso a esse link: `+ process.env.RESET_ACCOUNT_PASSWORD_PATH + "/" + resetPasswordToken,
        to: input.email
      });

      return false;
    } catch (error) {
      throw error;
    }
  }
}
