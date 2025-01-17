import { IidentityService } from "../../domain/services/Iidentity.service";
import { ValidationError } from "../../errors/validation.error";
import { UnknownError } from "../../errors/unknown.error";
import { SyncUserAccountOnTenantsUseCase } from "./syncUserAccountOnTenants.useCase";
import { IUser, User } from "../../domain/entities/user.model";
import { IUserAccessData } from "../../domain/entities/userAcessData.model";
import UserRepository from "../../domain/repositories/user.repository";

export type SignInInputDTO = {
  email: string;
  password: string;
}

export type SignInOutputDTO = {
  user: IUser
  tokens: IUserAccessData
}

export class SignInUseCase {

  constructor(
    private identityService: IidentityService,
    private userRepository: UserRepository
  ) { }

  async execute(input: SignInInputDTO): Promise<SignInOutputDTO> {
    try {
      const accessData = await this.identityService.signIn(input.email, input.password);

      let user = await this.userRepository.findOne({ UID: accessData.user.UID });

      const tenantUID = process.env.TENANT_ID;

      accessData.user.email = input.email;

      if(tenantUID == undefined){
        throw new Error("TENANT_ID environment variables not populed");
      }

      if (user == null) {
        //TODO criar o usuário no banco de dados se ele não existir?
        user = await this.userRepository.create(new User({
          UID: accessData.user.UID,//UID do servidor de identidade
          userName: accessData.user.userName,
          firstName: accessData.user.firstName,
          lastName: accessData.user.lastName,
          isAdministrator: false,
          email: accessData.user.email,
          tenantUID: tenantUID
        }));
      }

      const syncUserAccountOnTenantsUseCase : SyncUserAccountOnTenantsUseCase = new SyncUserAccountOnTenantsUseCase();
      await syncUserAccountOnTenantsUseCase.execute(accessData.user.UID!, accessData);

      accessData.user.id = user!.id;
      //TODO verificar se o usuário está presente no grupo que dá permissão a aplicação para permitir ou não ele de realizar o acesso

      return accessData;
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      } else {
        throw new UnknownError("Error to signin. Detalhes: " + error);
      }

    }
  }
}