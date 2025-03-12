import { IUser } from "../../domain/entities/user.model";
import { IidentityService } from "../../domain/services/Iidentity.service";
import { checkEmailIsValid } from "../../utils/verifiers.util";

export type CheckUserExistInputDTO = {
  email?: string;
  mobilePhone?: string;
}

export class CheckUserExistUseCase {

  constructor(
    private identityService: IidentityService
  ) {
  }

  async execute(input: CheckUserExistInputDTO): Promise<boolean> {

    try {

      if (input.email != undefined) {
        if (checkEmailIsValid(input.email) == false) {
          return false;
        };

        const user: IUser = await this.identityService.getUserByEmail(input.email);

      } else if (input.mobilePhone != undefined) {
        //TODO verificar formato do número
        const user: IUser = await this.identityService.getUserByMobilePhone(input.mobilePhone);

        console.log("usuário obtido ao verificar com o número de celular: ", user);
      }
      
      return true;

    } catch (error) {
      throw error;
    }
  }

}