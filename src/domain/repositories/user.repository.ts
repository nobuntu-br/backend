import { createDbAdapter } from "../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../infra/database/IDatabase.adapter";
import { UnknownError } from "../../errors/unknown.error";
import TenantConnection from "../entities/tenantConnection.model";
import { IUserDatabaseModel, User } from "../entities/user.model";
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

  async isUserAdminById(userId: number): Promise<boolean> {
    try {
      const _user = await this.adapter.findOne({ id: userId });

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
        return true;
      }
      return false;

    } catch (error) {
      throw new UnknownError("Error to check if application has registered Users. Detail: "+ error);
    }
  }


}