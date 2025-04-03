import { ITenantDatabaseModel } from "../../domain/entities/tenant.model";
import TenantConnection from "../../domain/entities/tenantConnection.model";
import { User } from "../../domain/entities/user.model";
import TenantRepository from "../../domain/repositories/tenant.repository";
import UserRepository from "../../domain/repositories/user.repository";
import { UnknownError } from "../../errors/unknown.error";
import { ValidationError } from "../../errors/validation.error";
import { GetSecurityTenantConnectionUseCase } from "./getSecurityTenantConnection.useCase";

export type GetTenantsUserIsAdminInputDTO = {
  userUID: string;
}

export class GetTenantsUserIsAdminUseCase {
  constructor() { }

  async execute(input: GetTenantsUserIsAdminInputDTO): Promise<ITenantDatabaseModel[]> {

    const getSecurityTenantConnectionUseCase: GetSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();
    const securityTenantConnection: TenantConnection = await getSecurityTenantConnectionUseCase.execute();

    const userRepository: UserRepository = new UserRepository(securityTenantConnection);
    const tenantRepository: TenantRepository = new TenantRepository(securityTenantConnection);

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
      tenants = await tenantRepository.findMany({ownerUserId: user.id}, 50, 1);
    } catch (error) {
      throw new UnknownError("Error to get Tenants. Erro to find tenant by userUID.");
    }

    return tenants;
    
  }
}