import { UserTenant } from "../../models/userTenant.model";
import UserTenantService from "../../services/userTenant.service";

export class GetUserTenantsUseCase {
  constructor(
    private userTenantService: UserTenantService
  ) { }

  async execute(UserUID: string): Promise<UserTenant[] | null> {
    try {
      const userTenants = await this.userTenantService.getUserTenantsWithDefaultTenant(UserUID);
      return userTenants;
    } catch (error) {
      throw error;
    }
  }
}