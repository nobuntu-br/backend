import { VerificationEmailService } from '../../services/verificationEmail.service';
import { EmailService } from '../../services/email.service';
import { NodemailerAdapter } from '../../adapters/nodeMailer.adapter';

export class SendVerificationCodeToEmailUseCase {
  constructor(
    private verificationEmailService: VerificationEmailService
  ) { }

  // async execute(email: string): Promise<{ success: boolean, message: string, error?: any }> {
  async execute(email: string): Promise<boolean> {
    const verificationCode : string = Math.floor(100000 + Math.random() * 900000).toString(); // Gera um código de 6 dígitos

    try {

      //Adapter do nodeMailer
      const emailAdapter: NodemailerAdapter = new NodemailerAdapter();
      const emailService: EmailService = new EmailService(emailAdapter);

      await emailService.sendEmail(email, "Seu Código de Verificação", `Seu código de verificação é: ${verificationCode}`)
      
      // Armazenar o código de verificação em uma variável global
      await this.verificationEmailService.create({
        verificationCode: verificationCode,
        email: email,
      });

      return true;

    } catch (error) {
      throw new Error("Erro ao enviar código de verificação. "+error);
    }
  }
}
