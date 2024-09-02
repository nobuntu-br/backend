import { UserTenant } from "../../models/userTenant.model";
import UserTenantService from "../../services/userTenant.service";

export class GetUserTenantsUseCase {
  constructor(
    private userTenantService: UserTenantService
  ) { }

  async execute(UserUID: string): Promise<UserTenant[] | null> {
    try {
      //Tem que fazer um repository que busque tanto os tenants com o userID como pega o padrão também, em uma busca só
      const userTenants = await this.userTenantService.getUserTenantsWithDefaultTenant(UserUID);
      //TODO se tiver registro sem user definido, retorne junto
      return userTenants;
    } catch (error) {
      throw error;
    }
  }
}