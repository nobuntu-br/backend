import { SignInDTO, SignInOutputDTO } from "../../models/DTO/signin.DTO";
import { IidentityService } from "../../services/Iidentity.service";
import { ValidationError } from "../../errors/validation.error";
import { UnknownError } from "../../errors/unknown.error";

export class SignInUseCase {

  constructor(
    private identityService: IidentityService
  ) {}

  async execute(input: SignInDTO): Promise<SignInOutputDTO> {
    try {
      const user = await this.identityService.loginUser(input.email, input.password);

      return user;
    } catch (error: any) {
      if(error instanceof ValidationError){
        throw error;
      } else {
        throw new UnknownError("Error to signin. Detalhes: "+error);
      }

    }
  }
}