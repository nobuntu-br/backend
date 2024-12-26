import { IDatabasePermission } from '../../models/databasePermission.model';
import UserRepository from '../../repositories/user.repository';
import DatabasePermissionRepository from '../../repositories/databasePermission.repository';

export type RegisterTenantPermissionInputDTO = {
  user?: number;
  tenant: number;
  databaseCredential: number;
  userUID: string;
  isAdmin?: boolean;
}

export class RegisterTenantPermissionUseCase {
  constructor(
    private databasePermissionRepository: DatabasePermissionRepository,
    private userRepository: UserRepository
  ) { }

  async execute(input: RegisterTenantPermissionInputDTO): Promise<IDatabasePermission> {

    try {

      //Verificar se a permissão existe
      const databaseCredential = await this.databasePermissionRepository.findOne({ tenantId: input.tenant, userUID: input.userUID, databaseCredentialId: input.databaseCredential });
      //Se permissão nÃo existir, crie
      if (databaseCredential == null) {
        throw new Error("Erro ao registrar novo UserTenant. Registro já existente!");
      }

      //Obter o ID do usuário pelo UID pra registrar
      const user = await this.userRepository.findOne({UID: input.userUID});

      if(user == null){
        throw new Error("Erro ao registrar novo UserTenant. Usuário não existe!");
      }

      return await this.databasePermissionRepository.create(
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