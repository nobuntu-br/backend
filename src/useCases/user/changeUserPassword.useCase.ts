import { ChangeUserPasswordDTO } from "../../models/DTO/changeUserPassword.DTO";
import { IUser } from "../../models/user.model";
import { IidentityService } from "../../services/Iidentity.service";

/**
 * Caso de uso para mudança de senha do usuário
 */
export class ChangeUserPasswordUseCase {

  constructor(
    private identityService: IidentityService
  ) {}

  async execute(input: ChangeUserPasswordDTO): Promise<boolean> {
    try {
      //TODO será obtido um JWT que será para verificar se ainda é possível realizar a alteraçào da senha do usuário

      const user: IUser = await this.identityService.getUserByEmail(input.email);

      await this.identityService.changeUserPassword(user.UID!, input.password);

      return true;
    } catch (error) {
      throw error;
    }
    
  }
}
