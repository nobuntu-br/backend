import { createDbAdapter } from "../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../infra/database/IDatabase.adapter";
import { UserPasswordResetTokenRepositoryMongoose } from "../../infra/database/mongoose/repositories/userPasswordResetToken.repository";
import { UserPasswordResetTokenRepositorySequelize } from "../../infra/database/sequelize/repositories/userPasswordResetToken.repository";
import TenantConnection from "../entities/tenantConnection.model";
import { IUserPasswordResetTokenDatabaseModel, UserPasswordResetToken } from "../entities/userPasswordResetToken.model";
import BaseRepository from "./base.repository";

export interface IUserPasswordResetTokenRepository {

}

export default class UserPasswordResetTokenRepository extends BaseRepository<IUserPasswordResetTokenDatabaseModel, UserPasswordResetToken> {
  advancedSearches: IUserPasswordResetTokenRepository;

  constructor(tenantConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<IUserPasswordResetTokenDatabaseModel, UserPasswordResetToken> = createDbAdapter<IUserPasswordResetTokenDatabaseModel, UserPasswordResetToken>(tenantConnection.models!.get("UserPasswordResetToken"), tenantConnection.databaseType, tenantConnection.connection, UserPasswordResetToken.fromJson);
    super(_adapter, tenantConnection);

    if (tenantConnection.databaseType === 'mongodb') {
      this.advancedSearches = new UserPasswordResetTokenRepositoryMongoose(this.tenantConnection, this.adapter);
    } else {
      this.advancedSearches = new UserPasswordResetTokenRepositorySequelize(this.tenantConnection, this.adapter);
    }
  }

  async checkIfExpired(userId: number): Promise<boolean> {
    try {
      const userPasswordResetToken: UserPasswordResetToken | null = await this.adapter.findOne({ userId: userId });

      if (userPasswordResetToken == null) {
        throw new Error("Não existe token para esse e-mail");
      }

      return userPasswordResetToken.isExpired();

    } catch (error) {
      throw new Error("Erro ao verificar se o token está valido");
    }
  }

}