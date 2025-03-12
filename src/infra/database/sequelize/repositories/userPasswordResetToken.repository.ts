import TenantConnection from "../../../../domain/entities/tenantConnection.model";
import { IUserPasswordResetTokenDatabaseModel, UserPasswordResetToken } from "../../../../domain/entities/userPasswordResetToken.model";
import { IUserPasswordResetTokenRepository } from "../../../../domain/repositories/userPasswordResetToken.repository";
import { IDatabaseAdapter } from "../../IDatabase.adapter";

export class UserPasswordResetTokenRepositorySequelize implements IUserPasswordResetTokenRepository {
  constructor(private tenantConnection: TenantConnection, private adapter: IDatabaseAdapter<IUserPasswordResetTokenDatabaseModel, UserPasswordResetToken>) {}
  
  
}
