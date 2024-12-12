import createDbAdapter from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { NotFoundError } from "../errors/notFound.error";
import { UnknownError } from "../errors/unknown.error";
import TenantConnection from "../models/tenantConnection.model";
import { IUserDatabaseModel, User } from "../models/user.model";
import BaseRepository from "./base.repository";

export default class UserRepository extends BaseRepository<IUserDatabaseModel, User> {

  constructor(tenantConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<IUserDatabaseModel, User> = createDbAdapter<IUserDatabaseModel, User>(tenantConnection.models!.get("User"), tenantConnection.databaseType, tenantConnection.connection, User.fromJson);
    super(_adapter, tenantConnection);
  }

  async isUserAdmin(userUID: string): Promise<boolean> {
    try {
      const _user = await this.adapter.findOne({ UID: userUID });

      if (_user != null && _user.isAdministrator != null) {
        //Se o usuário é administrador
        if (_user.isAdministrator == true) {
          return true;
        }
      }
      return false;

    } catch (error) {
      throw new UnknownError("Error to check if user is Admin. Detail: "+ error);
    }
  }

  async IfApplicationHasRegisteredUsers() {
    try {
      const users: User[] = await this.adapter.findAll(1, 1);

      if (users.length == 0) {
        console.log("Já existe usuário cadastrado nessa aplicação!");
        return true;
      }
      console.log("Não existe usuário cadastrado nessa aplicação!");
      return false;

    } catch (error) {
      throw new UnknownError("Error to check if application has registered Users. Detail: "+ error);
    }
  }


}