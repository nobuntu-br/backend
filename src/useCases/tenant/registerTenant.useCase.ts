import { Tenant } from "../../domain/entities/tenant.model";
import TenantConnection from "../../domain/entities/tenantConnection.model";
import { User } from "../../domain/entities/user.model";
import TenantRepository from "../../domain/repositories/tenant.repository";
import UserRepository from "../../domain/repositories/user.repository";
import { UnknownError } from "../../errors/unknown.error";
import { ValidationError } from "../../errors/validation.error";
import { GetSecurityTenantConnectionUseCase } from "./getSecurityTenantConnection.useCase";

export type RegisterTenantInputDTO = {
  name: string;
  userUID: string;

}

export class RegisterTenantUseCase {
  constructor(

  ) { }

  async execute(input: RegisterTenantInputDTO): Promise<Tenant> {

    const tenantLimitPerUser: number = 20;

    const getSecurityTenantConnectionUseCase: GetSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();
    const securityTenantConnection: TenantConnection = await getSecurityTenantConnectionUseCase.execute();

    const userRepository: UserRepository = new UserRepository(securityTenantConnection);
    const tenantRepository: TenantRepository = new TenantRepository(securityTenantConnection);

    let user: User | null = null;
    try {
      user = await userRepository.findOne({ UID: input.userUID });
    } catch (error) {
      throw new UnknownError("Error to register Tenant. Erro to find user by userUID.");
    }

    if (user == null) {
      throw new ValidationError("Error to register Tenant. Invalid User.");
    }

    let tenantCount: number;
    try {
      tenantCount = await tenantRepository.getCount();
    } catch (error) {
      throw new UnknownError("Error to register Tenant. Erro to get tenants count.");
    }

    if (tenantCount >= tenantLimitPerUser) {
      throw new ValidationError("Error to register Tenant. Tenant limit per user reached.");
    }

    try {
      const tenant = await tenantRepository.create({
        name: input.name,
        ownerUserId: user.id
      });

      return tenant;
    } catch (error) {
      throw new UnknownError("Error to register Tenant. Erro create tenant on database.");
    }

  }
}