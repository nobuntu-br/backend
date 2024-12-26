import { IidentityService } from "../../services/Iidentity.service";
import { ValidationError } from "../../errors/validation.error";
import { UnknownError } from "../../errors/unknown.error";
import { IUser } from "../../models/user.model";
import { IUserAccessData } from "../../models/userAcessData.model";

export type SignInInputDTO = {
  email: string;
  password: string;
}

export type SignInOutputDTO = {
  user: IUser
  tokens: IUserAccessData
}

/*
user: {
          UID: profile.sub,
          tenantUID: this.tenantID,
          userName: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: username
        },
        tokens: {
          accessToken: loginUserResponse.data.access_token,
          refreshToken: loginUserResponse.data.refresh_token,
          tokenType: loginUserResponse.data.token_type,
          expiresAt: loginUserResponse.data.expires_at,
        }
          */

export class SignInUseCase {

  constructor(
    private identityService: IidentityService
  ) { }

  async execute(input: SignInInputDTO): Promise<SignInOutputDTO> {
    try {
      const user = await this.identityService.loginUser(input.email, input.password);

      //TODO verificar se o usuário está presente no grupo que dá permissão a aplicação para permitir ou não ele de realizar o acesso
      


      return user;
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      } else {
        throw new UnknownError("Error to signin. Detalhes: " + error);
      }

    }
  }
}