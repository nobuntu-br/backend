import { IUserAccessData } from "../../models/userAcessData.model";
import { SignInDTO, SignInOutputDTO } from "../../models/DTO/signin.DTO";
import { IidentityService } from "../../services/Iidentity.service";

export class SignInUseCase {

  constructor(
    private identityService: IidentityService
  ) {}

  async execute(input: SignInDTO): Promise<SignInOutputDTO> {
    try {
      const user = await this.identityService.loginUser(input.email, input.password);

      return user;
    } catch (error) {
      throw new Error("Erro ao realizar o acesso. Detalhes: "+error);
    }
  }
}