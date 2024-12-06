import UserTenantService from '../../services/databasePermission.service';
import { IDatabasePermission } from '../../models/databasePermission.model';
import { UserService } from '../../services/user.service';
import { DatabasePermissionDTO } from '../../models/DTO/databasePermission.DTO';

export class RegisterTenantPermissionUseCase {
  constructor(private userTenantService: UserTenantService, private userService: UserService) { }

  async execute(input: DatabasePermissionDTO): Promise<IDatabasePermission> {

    try {

      //Verificar se a permissão existe
      const userTenant = await this.userTenantService.findOne({ tenant: input.tenant, userUID: input.userUID, databaseCredential: input.databaseCredential });
      //Se permissão nÃo existir, crie
      if (userTenant == null) {
        throw new Error("Erro ao registrar novo UserTenant. Registro já existente!");
      }

      //Obter o ID do usuário pelo UID pra registrar
      const user = await this.userService.findOne({UID: input.userUID});

      if(user == null){
        throw new Error("Erro ao registrar novo UserTenant. Usuário não existe!");
      }

      return await this.userTenantService.create(
        {
          isAdmin: false,
          databaseCredential: input.databaseCredential,
          tenant: input.tenant,
          user: user.id,
          userUID: input.userUID
        }
      );

    } catch (error) {
      throw Error("Erro ao atualizar as permissões do Tenant: " + error);
    }

  }

}