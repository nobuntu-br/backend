import { IUser, User } from "../../models/user.model";
import { UserService } from "../../services/user.service";

export class RegisterUserUseCase {
  constructor(
    private userService: UserService,
  ) { }

  async execute(user: IUser): Promise<User> {
    try {

      console.log(user);
      //Verifica se usuário já existe
      const isUserExist = await this.userService.findOne(user);
      if (isUserExist != null) {
        throw new Error("Usuário já existe");
      }

      user.isAdministrator = false;

      //Cria o usuário
      const newUser: IUser = await this.userService.create(user);
      return newUser;

    } catch (error) {
      throw error;
    }
  }

}