import { UnknownError } from '../../errors/unknown.error';
import { DatabasePermission } from '../../models/databasePermission.model';
import DatabasePermissionRepository from '../../repositories/databasePermission.repository';

export class DeleteTenantPermissionUseCase {
  constructor(private databasePermissionRepository: DatabasePermissionRepository) { }

  async execute(databasePermissionId: number): Promise<DatabasePermission> {

    try {

      //Verificar se a permissão existe
      const databasePermission = await this.databasePermissionRepository.findById(databasePermissionId);

      if (databasePermission == null) {
        //Se permissão não existe, dá erro
        throw new UnknownError("Erro to register new permission.");
      }

      //Remove a permissão
      const removedUserTenant = await this.databasePermissionRepository.delete(databasePermissionId)!;

      if(removedUserTenant == null){
        throw new UnknownError("Erro ao remover a permissão do tenant.");
      }

      return removedUserTenant;

    } catch (error) {
      throw new UnknownError("Erro ao atualizar as permissões do Tenant: " + error);
    }

  }

}