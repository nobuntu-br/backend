import { IUser } from '../../domain/entities/user.model';
import { VerificationEmail } from '../../domain/entities/verificationEmail.model';
import VerificationEmailRepository from '../../domain/repositories/verificationEmail.repository';
import { EmailService } from '../../domain/services/email.service';
import { IidentityService } from '../../domain/services/Iidentity.service';
import { ConflictError } from '../../errors/confict.error';
import { TooManyRequestsError } from '../../errors/tooManyRequests.error';
import { ValidationError } from '../../errors/validation.error';
import { checkEmailIsValid } from '../../utils/verifiers.util';

export type SendVerificationCodeToEmailInputDTO = {
  email: string;
}

export class SendVerificationCodeToEmailUseCase {
  constructor(
    private verificationEmailRepository: VerificationEmailRepository,
    private identityService: IidentityService
  ) { }

  async execute(input: SendVerificationCodeToEmailInputDTO): Promise<boolean> {

    if (checkEmailIsValid(input.email) == false) {
      throw new ValidationError("Email is invalid.");
    };

    let user: IUser | null = null;

    try {
      user = await this.identityService.getUserByEmail(input.email);
    } catch (error) {
      
    }

    if (user != null) {
      throw new ValidationError("User already exists.");
    }

    try {

      const verificationEmail: VerificationEmail | null = await this.verificationEmailRepository.findOne({
        email: input.email
      });

      if (verificationEmail != null) {
        if (await this.verificationEmailRepository.checkIfExpired(input.email) == true) {
          await this.verificationEmailRepository.delete(verificationEmail.id!);
        } else {

          if (verificationEmail.isVerified == true) {
            throw new ConflictError("Código já enviado para esse email");
          } else {
            throw new TooManyRequestsError("O e-mail de verificação já foi enviado recentemente. Aguarde antes de solicitar novamente");
          }

        }
      }

      const verificationCode: string = Math.floor(100000 + Math.random() * 900000).toString(); // Gera um código de 6 dígitos

      const emailService: EmailService = new EmailService();

      //TODO mensagem tem que ser com o idioma de acordo com o que foi definido na aplicação
      await emailService.sendEmailWithDefaultEmail({
        subject: "Seu Código de Verificação",
        text: `Seu código de verificação é: ${verificationCode}`,
        to: input.email
      });

      const currentTime: Date = new Date();

      await this.verificationEmailRepository.create(new VerificationEmail({
        verificationCode: verificationCode,
        email: input.email,
        isVerified: false,
        expirationDate: new Date(currentTime.getTime() + 30 * 60 * 1000)//Adiciona 30 minutos
      }));

      return true;

    } catch (error) {
      throw error;
    }
  }
}
