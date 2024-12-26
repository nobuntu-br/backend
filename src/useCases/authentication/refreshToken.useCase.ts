import { IidentityService } from "../../services/Iidentity.service";

type RefreshTokenInputDTO = {
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private identityService: IidentityService
  ) { }

  async execute(input: RefreshTokenInputDTO): Promise<string> {

    return await this.identityService.refreshAccessToken(input.refreshToken);
  }
}
