import { CheckEmailExistDTO } from "../../models/DTO/checkEmailExist.DTO";
import { IUser } from "../../models/user.model";
import { IidentityService } from "../../services/Iidentity.service";

export class CheckEmailExistUseCase {

  constructor(
    private identityService: IidentityService
  ) {
  }

  async execute(input: CheckEmailExistDTO): Promise<boolean> {
    
    try {

      const user: IUser = await this.identityService.getUserByEmail(input.email);

      return true;

    } catch (error) {
      // throw new Error("Falha ao verificar a existência do email. Detalhes: "+error);
      throw error;
    }
  }

}