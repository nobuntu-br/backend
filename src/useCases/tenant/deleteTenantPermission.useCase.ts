import UserTenantService from '../../services/userTenant.service';
import { IUserTenant } from '../../models/userTenant.model';

export class DeleteTenantPermissionUseCase {
  constructor(private userTenantService: UserTenantService) { }

  async execute(userTenantId: string): Promise<IUserTenant | Error> {

    try {

      //Verificar se a permissão existe
      const userTenant = await this.userTenantService.findById(userTenantId);

      if (userTenant == null) {
        //Se permissão não existe, dá erro
        return new Error("Erro ao registrar novo UserTenant. Registro não existente!");
      }

      //Remove a permissão
      const removedUserTenant = await this.userTenantService.delete(userTenantId)!;

      if(removedUserTenant == null){
        return Error("Erro ao remover a permissão do tenant.");
      }

      return removedUserTenant;

    } catch (error) {
      return Error("Erro ao atualizar as permissões do Tenant: " + error);
    }

  }

}
