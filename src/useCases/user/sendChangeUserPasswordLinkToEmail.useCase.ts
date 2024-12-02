import { EmailService } from '../../services/email.service';
import { SendResetPasswordLinkToEmailDTO } from '../../models/DTO/sendResetPasswordLinkToEmail.DTO';

export class SendChangeUserPasswordLinkToEmailUseCase {
  constructor(
    private emailService: EmailService
  ) { }

  async execute(input: SendResetPasswordLinkToEmailDTO): Promise<boolean> {

    const applicationName = process.env.APPLICATION_NAME;
    const resetAccountPasswordPath = process.env.RESET_ACCOUNT_PASSWORD_PATH;

    if(applicationName == undefined || applicationName == '' || resetAccountPasswordPath == undefined || resetAccountPasswordPath == ''){
      throw new Error("Dados relacionados a envio de email de alteraçãod e senha da conta não estão preechidos nas variáveis ambiente!");
    }

    //TODO gerar um JWT que irá ser enviado junto com o link do SPA para recuperação da senha

    
    try {

      await this.emailService.sendEmail({
        subject: "Recuperação de email do serviço "+process.env.APPLICATION_NAME,
        text: `Para alterar a senha da sua conta faça o acesso a esse link: `+ process.env.RESET_ACCOUNT_PASSWORD_PATH,
        to: input.email
      });

      return false;
    } catch (error) {
      throw error;
    }
  }
}
