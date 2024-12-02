import { DatabaseType } from "../adapters/createDb.adapter";
import { NotFoundError } from "../errors/notFound.error";
import { IUser, User } from "../models/user.model";
import UserRepository from "../repositories/user.repository";
import BaseService from "./base.service";

export class UserService extends BaseService<User> {
  private userRepository: UserRepository;

  constructor(databaseType: DatabaseType, databaseConnection: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository: UserRepository = new UserRepository(databaseType, databaseConnection);
    super(repository, databaseType, databaseConnection);

    this.userRepository = repository;
  }

  /**
   * Verifica se usuário é administrador
   * @param {*} userUID identificador universal do usuário
   * @param {*} databaseConnection instância da conexão com o banco de dados
   * @returns "True" caso usuário for adminitrador, caso contrário, retorna "False"
   */
  async isUserAdmin(userUID: string): Promise<boolean> {
    try {
      const _user = await this.repository.findOne({ UID: userUID });

      if (_user != null && _user.isAdministrator != null) {
        //Se o usuário é administrador
        if (_user.isAdministrator == true) {
          return true;
        }
      }
      return false;

    } catch (error) {
      console.error({ message: "Erro ao obter o usuário", details: error });
      return false;
    }
  }

  async IfApplicationHasRegisteredUsers() {
    try {
      const users: IUser[] = await this.repository.findAll(1, 1);

      if (users.length == 0) {
        console.log("Já existe usuário cadastrado nessa aplicação!");
        return true;
      }
      console.log("Não existe usuário cadastrado nessa aplicação!");
      return false;

    } catch (error) {
      throw new NotFoundError("Erro ao buscar usuários no banco de dados. " + error);
    }
  }

}