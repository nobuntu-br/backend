//TODO pegar os tenants que o usuário é administrador (mudar no futuro pra permitir ver que tem permissào)

import { ITenantDatabaseModel } from "../../domain/entities/tenant.model";
import TenantConnection from "../../domain/entities/tenantConnection.model";
import { User } from "../../domain/entities/user.model";
import DatabaseCredentialRepository from "../../domain/repositories/databaseCredential.repository";
import TenantRepository from "../../domain/repositories/tenant.repository";
import UserRepository from "../../domain/repositories/user.repository";
import { UnknownError } from "../../errors/unknown.error";
import { ValidationError } from "../../errors/validation.error";
import { GetSecurityTenantConnectionUseCase } from "./getSecurityTenantConnection.useCase";
import { GetTenantsUserIsAdminUseCase } from "./getTenantsUserIsAdmin.useCase";

export class GetUsersWithTenantAccessUseCase {
  constructor(
    private getTenantsUserIsAdminUseCase: GetTenantsUserIsAdminUseCase
  ) { }

  async execute(): Promise<ITenantDatabaseModel[]> {

    //Verifica se tu é admin

    //Percorre os databasePermission para pegar os usuários

    const getSecurityTenantConnectionUseCase: GetSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();
    const securityTenantConnection: TenantConnection = await getSecurityTenantConnectionUseCase.execute();

    const userRepository: UserRepository = new UserRepository(securityTenantConnection);
    const databaseCredentialRepository: DatabaseCredentialRepository = new DatabaseCredentialRepository(securityTenantConnection);

    let user: User | null = null;
    try {
      user = await userRepository.findOne({ UID: input.userUID });
    } catch (error) {
      throw new UnknownError("Error to get Tenants. Erro to find user by userUID.");
    }

    if (user == null) {
      throw new ValidationError("Error to get Tenants. Invalid User.");
    }

    let tenants : ITenantDatabaseModel[] = [];

    try {
      // tenants = await tenantRepository.findMany({ownerUserId: user.id});
      users = await databaseCredentialRepository.advancedSearches.getDatabaseCredentialByTenantId(tenantId, user.id);
    } catch (error) {
      throw new UnknownError("Error to get Tenants. Erro to find tenant by userUID.");
    }

    return tenants;
    
  }
}