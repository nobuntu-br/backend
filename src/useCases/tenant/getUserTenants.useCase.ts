import { DatabasePermission } from "../../domain/entities/databasePermission.model";
import DatabasePermissionRepository from "../../domain/repositories/databasePermission.repository";
import { NotFoundError } from "../../errors/notFound.error";

export type DatabasePermissionDetailOutputDTO = {
  tenant: {
    id: number,
    name: string
  };
  databaseCredential: {
    id: number,
  };
  userUID: string;
  userId: number;
  isAdmin?: boolean;
}

export class GetUserTenantsUseCase {
  constructor(
    private databasePermissionRepository: DatabasePermissionRepository,
  ) { }

  async execute(userUID: string): Promise<DatabasePermissionDetailOutputDTO[]> {
    try {
      
      const tenants : DatabasePermissionDetailOutputDTO[] = await this.databasePermissionRepository.getTenantsUserHasAccess(userUID);
      
      if(tenants == null || tenants.length == 0){
        throw new NotFoundError("Não foram encontrados tenants que pertencem a esse usuário");
      }
      
      return tenants;
    } catch (error) {
      throw error;
    }
  }
}