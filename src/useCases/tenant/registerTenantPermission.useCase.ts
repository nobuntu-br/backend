import UserTenantService from '../../services/databasePermission.service';
import { IDatabasePermission } from '../../models/databasePermission.model';
import { UserService } from '../../services/user.service';
import { DatabasePermissionDTO } from '../../models/DTO/databasePermission.DTO';

export class RegisterTenantPermissionUseCase {
  constructor(private userTenantService: UserTenantService, private userService: UserService) { }

  async execute(userTenantDTO: DatabasePermissionDTO): Promise<IDatabasePermission> {

    try {

      //Verificar se a permissão existe
      const userTenant = await this.userTenantService.findOne({ tenantId: userTenantDTO.tenantId, userUID: userTenantDTO.userUID, databaseCredentialId: userTenantDTO.databaseCredentialId });
      //Se permissão nÃo existir, crie
      if (userTenant == null) {
        throw new Error("Erro ao registrar novo UserTenant. Registro já existente!");
      }

      //Obter o ID do usuário pelo UID pra registrar
      const user = await this.userService.findOne({UID: userTenantDTO.userUID});

      if(user == null){
        throw new Error("Erro ao registrar novo UserTenant. Usuário não existe!");
      }

      return await this.userTenantService.create(
        {
          isAdmin: false,
          databaseCredentialId: userTenantDTO.databaseCredentialId,
          tenantId: userTenantDTO.tenantId,
          userId: user.UID,
          userUID: userTenantDTO.userUID
        }
      );

    } catch (error) {
      throw Error("Erro ao atualizar as permissões do Tenant: " + error);
    }

  }

}