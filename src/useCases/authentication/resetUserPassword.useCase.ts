import { NotFoundError } from "../../errors/notFound.error";
import { IidentityService } from "../../domain/services/Iidentity.service";
import { TokenGenerator } from "../../utils/tokenGenerator";
import { User } from "../../domain/entities/user.model";
import UserRepository from "../../domain/repositories/user.repository";

interface JwtPayload {
  email: string
}

export type ResetUserPasswordInputDTO = {
  password: string;
  resetPasswordToken: string;
}

/**
 * Caso de uso para mudança de senha do usuário
 */
export class ResetUserPasswordUseCase {

  constructor(
    private identityService: IidentityService,
    private tokenGenerator: TokenGenerator,
    private userRepository: UserRepository
  ) {}

  async execute(input: ResetUserPasswordInputDTO): Promise<boolean> {
    try {
      //TODO será obtido um JWT que será para verificar se ainda é possível realizar a alteraçào da senha do usuário

      
      //Validar JWT e pegar o payload
      const payload = this.tokenGenerator.verifyToken(input.resetPasswordToken) as JwtPayload;

      let user: User | null = await this.userRepository.findOne({email: payload.email});
      
      if(user == null){
        throw new NotFoundError("Error to reset password. User not found.");
      }

      try {
        await this.identityService.resetUserPassword(user.UID!, input.password);
      } catch (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      throw error;
    }
    
  }
}
