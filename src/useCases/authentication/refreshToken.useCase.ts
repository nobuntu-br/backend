import { IidentityService } from "../../domain/services/Iidentity.service";
import { SignInOutputDTO } from "./signIn.useCase";

type RefreshTokenInputDTO = {
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private identityService: IidentityService
  ) { }

  async execute(input: RefreshTokenInputDTO): Promise<SignInOutputDTO> {
    return await this.identityService.refreshToken(input.refreshToken);
  }
}
