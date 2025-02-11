import { IUser, User } from "../../domain/entities/user.model";
import { IUserAccessData } from "../../domain/entities/userAcessData.model";
import UserRepository from "../../domain/repositories/user.repository";
import { IidentityService } from "../../domain/services/Iidentity.service";
import { UnknownError } from "../../errors/unknown.error";
import { ValidationError } from "../../errors/validation.error";
import { RefreshTokenOutputDTO, RefreshTokenUseCase } from "./refreshToken.useCase";
import { SyncUserAccountOnTenantsUseCase } from "./syncUserAccountOnTenants.useCase";

type SingleSignOnInputDTO = {
  refreshToken: string;
}

type SingleSignOnOutputDTO = {
  user: IUser
  tokens: IUserAccessData
}

export class SingleSignOnUseCase {

  constructor(
    private identityService: IidentityService,
    private userRepository: UserRepository
  ) { }

  async execute(input: SingleSignOnInputDTO): Promise<SingleSignOnOutputDTO> {

    let refreshTokenResponse: RefreshTokenOutputDTO;
    //Refresh token
    try {
      const refreshTokenUseCase: RefreshTokenUseCase = new RefreshTokenUseCase(this.identityService);
      refreshTokenResponse = await refreshTokenUseCase.execute({ refreshToken: input.refreshToken });
    } catch (error) {
      throw new UnknownError("Error refresh token on SSO operation. Details: " + error);
    }

    const tenantUID = process.env.TENANT_ID;

    if (tenantUID == undefined) {
      throw new Error("TENANT_ID environment variables not populed");
    }

    let user = await this.userRepository.findOne({ UID: refreshTokenResponse.user.UID });
    try {
      if (user == null) {
        user = await this.userRepository.create(new User({
          UID: refreshTokenResponse.user.UID,//UID do servidor de identidade
          userName: refreshTokenResponse.user.userName,
          firstName: refreshTokenResponse.user.firstName,
          lastName: refreshTokenResponse.user.lastName,
          isAdministrator: false,
          email: refreshTokenResponse.user.email,
          tenantUID: tenantUID
        }));
      } else {
        await this.userRepository.update(
          user.id!,
          {
            UID: refreshTokenResponse.user.UID,//UID do servidor de identidade
            userName: refreshTokenResponse.user.userName,
            firstName: refreshTokenResponse.user.firstName,
            lastName: refreshTokenResponse.user.lastName,
            isAdministrator: false,
            email: refreshTokenResponse.user.email,
            tenantUID: tenantUID
          }
        );
      }
    } catch (error) {
      throw new ValidationError("SingleSignOn error. Error to save user on security database.");
    }

    try {
      const syncUserAccountOnTenantsUseCase: SyncUserAccountOnTenantsUseCase = new SyncUserAccountOnTenantsUseCase();
      const value = await syncUserAccountOnTenantsUseCase.execute(refreshTokenResponse.user.UID!, refreshTokenResponse.user);
    } catch (error) {
      throw new UnknownError("Error to sync user with aplication tenants. Detail: " + error);
    }

    return refreshTokenResponse;
  }
}