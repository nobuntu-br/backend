import { DatabasePermission } from '../../models/databasePermission.model';
import DatabasePermissionRepository from '../../repositories/databasePermission.repository';

export class DeleteTenantPermissionUseCase {
  constructor(private databasePermissionRepository: DatabasePermissionRepository) { }

  async execute(databasePermissionId: number): Promise<DatabasePermission | Error> {

    try {

      //Verificar se a permissão existe
      const userTenant = await this.databasePermissionRepository.findById(databasePermissionId);

      if (userTenant == null) {
        //Se permissão não existe, dá erro
        return new Error("Erro ao registrar novo UserTenant. Registro não existente!");
      }

      //Remove a permissão
      const removedUserTenant = await this.databasePermissionRepository.delete(databasePermissionId)!;

      if(removedUserTenant == null){
        return Error("Erro ao remover a permissão do tenant.");
      }

      return removedUserTenant;

    } catch (error) {
      return Error("Erro ao atualizar as permissões do Tenant: " + error);
    }

  }

}