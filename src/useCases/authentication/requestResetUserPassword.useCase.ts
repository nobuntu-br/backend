import { NotFoundError } from "../../errors/notFound.error";
import { TokenGenerator } from "../../utils/tokenGenerator";
import { IUser } from "../../domain/entities/user.model";
import UserRepository from "../../domain/repositories/user.repository";
import { ValidationError } from "../../errors/validation.error";
import UserPasswordResetTokenRepository from "../../domain/repositories/userPasswordResetToken.repository";
import { UserPasswordResetToken } from "../../domain/entities/userPasswordResetToken.model";
import { IEmailService } from "../../domain/services/Iemail.service";
import { ConflictError } from "../../errors/confict.error";
import { TooManyRequestsError } from "../../errors/tooManyRequests.error";
import { ISMSService } from "../../domain/services/Isms.service";

export type RequestResetUserPasswordInputDTO = {
  userId: number;
}

/**
 * Caso de uso para mudança de senha do usuário
 */
export class RequestResetUserPasswordUseCase {

  constructor(
    private userPasswordResetTokenRepository: UserPasswordResetTokenRepository,
    private userRepository: UserRepository,
    private tokenGenerator: TokenGenerator,
    private frontEndURI: string,
    private emailService: IEmailService,
    private smsService: ISMSService

  ) { }

  //
  async execute(input: RequestResetUserPasswordInputDTO): Promise<boolean> {

    const applicationName = process.env.APPLICATION_NAME;
    const resetAccountPasswordPath = process.env.RESET_ACCOUNT_PASSWORD_PATH;
    const frontEndURL = process.env.FRONTEND_PATH;

    let user: IUser | null = null;

    try {
      user = await this.userRepository.findById(input.userId);
    } catch (error) {

    }

    if (user == null) {
      throw new ValidationError("Invalid user.");
    }

    if (user.email == null) {
      throw new Error("Request reset password with phone number not implemented yet");
    }

    try {

      const userPasswordResetToken: UserPasswordResetToken | null = await this.userPasswordResetTokenRepository.findOne({
        userId: user.id
      });

      if (userPasswordResetToken != null) {
        if (await this.userPasswordResetTokenRepository.checkIfExpired(input.userId) == true) {
          await this.userPasswordResetTokenRepository.delete(userPasswordResetToken.id!);
        } else {

          if (userPasswordResetToken.used == true) {
            throw new ConflictError("Código já enviado para esse email");
          } else {
            throw new TooManyRequestsError("O e-mail de verificação já foi enviado recentemente. Aguarde antes de solicitar novamente");
          }

        }
      }

    } catch (error) {
      throw error;
    }

    const defaultEmail: string | undefined = process.env.EMAIL_USER;

    if (defaultEmail == undefined) {
      throw new NotFoundError("Não foi definido email que irá ser quem mandará a mensagem para o usuário");
    }

    const token: string = this.tokenGenerator.generateToken({ userUID: user.UID }, 5000);

    try {
      
      if(user.email){
        await this.emailService.sendEmail({
          from: defaultEmail,
          subject: "Mudança de senha requisitada da aplicação " + applicationName,
          text: "Para realizar a alteração da senha acesse: " + this.frontEndURI + "/resetPassword/token=" + token,
          to: user.email
        });
      } else {
        await this.smsService.sendSMS({
          from: defaultEmail,
          message: "Mudança de senha requisitada de aplicação "+applicationName,
          to: user.mobilePhone
        });
      }

      const currentTime: Date = new Date();

      await this.userPasswordResetTokenRepository.create(new UserPasswordResetToken({
        token: token,
        user: user.id!,
        used: false,
        expiresAt: new Date(currentTime.getTime() + 5 * 60 * 1000)//Adiciona 5 minutos
      }));

      return true;
    } catch (error) {
      throw error;
    }

  }
}
