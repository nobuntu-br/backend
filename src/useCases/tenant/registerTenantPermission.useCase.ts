import UserTenantService from '../../services/userTenant.service';
import { IUserTenant, UserTenant } from '../../models/userTenant.model';
import { UserService } from '../../services/user.service';
import { UserTenantDTO } from '../../models/DTO/userTenant.DTO';

export class RegisterTenantPermissionUseCase {
  constructor(private userTenantService: UserTenantService, private userService: UserService) { }

  async execute(userTenantDTO: UserTenantDTO): Promise<IUserTenant> {

    try {

      //Verificar se a permissão existe
      const userTenant = await this.userTenantService.findOne({ TenantId: userTenantDTO.TenantId, UserUID: userTenantDTO.UserUID, TenantCredentialId: userTenantDTO.TenantCredentialId });
      //Se permissão nÃo existir, crie
      if (userTenant == null) {
        throw new Error("Erro ao registrar novo UserTenant. Registro já existente!");
      }

      //Obter o ID do usuário pelo UID pra registrar
      const user = await this.userService.findOne({UID: userTenantDTO.UserUID});

      if(user == null){
        throw new Error("Erro ao registrar novo UserTenant. Usuário não existe!");
      }

      return await this.userTenantService.create(
        {
          isAdmin: false,
          TenantCredentialId: userTenantDTO.TenantCredentialId,
          TenantId: userTenantDTO.TenantId,
          UserId: user.UID,
          UserUID: userTenantDTO.UserUID
        }
      );

    } catch (error) {
      throw Error("Erro ao atualizar as permissões do Tenant: " + error);
    }

  }

}
