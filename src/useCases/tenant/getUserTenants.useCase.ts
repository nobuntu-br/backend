import { NotFoundError } from "../../errors/notFound.error";
import { DatabasePermissionDetailOutputDTO } from "../../models/DTO/databasePermission.DTO";
import UserTenantRepository from "../../repositories/databasePermission.repository";

export class GetUserTenantsUseCase {
  constructor(
    private userTenantRepository: UserTenantRepository,
  ) { }

  async execute(userUID: string): Promise<DatabasePermissionDetailOutputDTO[]> {
    try {
      
      const tenants : DatabasePermissionDetailOutputDTO[] = await this.userTenantRepository.getTenantsUserHasAccess(userUID);
      
      if(tenants == null || tenants.length == 0){
        throw new NotFoundError("Não foram encontrados tenants que pertencem a esse usuário");
      }
      
      return tenants;
    } catch (error) {
      throw error;
    }
  }
}