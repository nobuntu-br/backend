import { CheckEmailExistDTO } from "../../models/DTO/checkEmailExist.DTO";
import { IUser } from "../../models/user.model";
import { UserService } from "../../services/user.service";
import { IidentityService } from "../../services/Iidentity.service";

export class CheckEmailExistUseCase {

  constructor(
    private userService: UserService,
    private identityService: IidentityService
  ) {
  }

  async execute(input: CheckEmailExistDTO): Promise<boolean> {
    
    try {

      const user: IUser = await this.identityService.getUserByEmail(input.email);

      //Verifica se usuário já existe
      const isUserExist = await this.userService.findOne({
        email: input.email
      });


      return true;

    } catch (error) {
      // throw new Error("Falha ao verificar a existência do email. Detalhes: "+error);
      throw error;
    }
  }

}