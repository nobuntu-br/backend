import { DatabasePermission } from "../../domain/entities/databasePermission.model";
import TenantConnection from "../../domain/entities/tenantConnection.model";
import { User } from "../../domain/entities/user.model";
import DatabaseCredentialRepository from "../../domain/repositories/databaseCredential.repository";
import DatabasePermissionRepository from "../../domain/repositories/databasePermission.repository";
import TenantRepository from "../../domain/repositories/tenant.repository";
import UserRepository from "../../domain/repositories/user.repository";
import { NotFoundError } from "../../errors/notFound.error";
import { GetSecurityTenantConnectionUseCase } from "./getSecurityTenantConnection.useCase";

type RemoveUserAccessToTenantInputDTO = {
  removingAccessUserUID: string;//UID de quem irá remover o acesso do usuário
  removedAccessUserId: number;//Id do usuário que terá acesso removido
  tenantId: number;
  databaseCredentialId: number;
}

export class RemoveUserAccessToTenantUseCase {

  constructor() {}

  async execute(input: RemoveUserAccessToTenantInputDTO): Promise<boolean> {
    const getSecurityTenantConnectionUseCase: GetSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();
    const securityDatabaseConnection: TenantConnection = await getSecurityTenantConnectionUseCase.execute();

    const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(securityDatabaseConnection);
    const userRepository: UserRepository = new UserRepository(securityDatabaseConnection);

    let removedAccessUser: User | null = null;

    try {
      removedAccessUser = await userRepository.findById(input.removedAccessUserId);
    } catch (error) {
      throw Error("Error to get removed access user on database. Detail: " + error);
    }

    let databasePermission: DatabasePermission | null = null;

    try {
      databasePermission = await databasePermissionRepository.findOne({
        databaseCredentialId: input.databaseCredentialId, 
        tenantId: input.tenantId,
        userId: input.removedAccessUserId
      });
    } catch (error) {
      throw Error("Error to get database permission do remove access user on database. Detail: " + error);
    }

    if(databasePermission == null){
      throw new NotFoundError("Not found database predential to remove access user on database.");
    }

    try {
      databasePermissionRepository.delete(databasePermission.id!);
    } catch (error) {
      throw Error("Error to remove access user on database. Detail: " + error);
    }

    return true;
  }
}