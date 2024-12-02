import { RegisterNewUserDTO } from "../../models/DTO/registerNewUser.DTO";
import { RegisterUserFromOtherApplicationDTO } from "../../models/DTO/registerUserFromOtherApplication.DTO";
import { IUser } from "../../models/user.model";
import { IidentityService } from "../../services/Iidentity.service";
import { UserService } from "../../services/user.service";

export class RegisterUserFromOtherApplicationUseCase {

  constructor(
    private userService: UserService,
    private identityService: IidentityService
  ) {}

  async execute(input: RegisterUserFromOtherApplicationDTO): Promise<any> {
    throw new Error("Method not implemented yet");

    //TODO obter o token de acesso do usuário

    //Verificar se o TOken não espirou e é válido

    //Decodificar o token de acesso

    //Ver se dentro do token tem a informação que o usuário tem acesso a essa aplicação

    //Registrar usuário no banco de dados
  }
}