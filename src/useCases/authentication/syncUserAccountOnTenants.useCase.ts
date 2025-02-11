import { connectTenant } from "../../infra/database/database.config";
import { DatabaseCredential } from "../../domain/entities/databaseCredential.model";
import { DatabasePermission } from "../../domain/entities/databasePermission.model";
import { User } from "../../domain/entities/user.model";
import DatabasePermissionRepository from "../../domain/repositories/databasePermission.repository";
import UserRepository from "../../domain/repositories/user.repository";
import { TenantConnectionService } from "../../domain/services/tenantConnection.service";
import { GetSecurityTenantConnectionUseCase } from "../tenant/getSecurityTenantConnection.useCase";
import { GetDefaultTenantConnectionUseCase } from "../tenant/getDefaultTenantConnection.useCase";
import TenantConnection from "../../domain/entities/tenantConnection.model";

/**
 * Realizar o cadastro ou atualização dos dados do usuário em todos os bancos de dados que ele tem acesso
 */
export class SyncUserAccountOnTenantsUseCase {
  constructor() { }

  async execute(userUID: string, accessData: any): Promise<boolean> {

    //Obter o security
    const getSecurityTenantConnectionUseCase: GetSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();
    const securityTenant = await getSecurityTenantConnectionUseCase.execute();

    const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(securityTenant);

    //Varrer no security todos os bancos que esse usuário tem acesso
    let databasePermissions: DatabasePermission[] = await databasePermissionRepository.findDatabaseCredentialByUserUID(userUID);

    for (let index = 0; index < databasePermissions.length; index++) {
      const databaseCredential = databasePermissions[index].databaseCredential as DatabaseCredential;

      try {

        //Realizar a conexão em todo tenant para atualizar o usuário neles
        const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;

        let databaseConnection = tenantConnectionService.findOneConnection(databaseCredential.id!);

        if (databaseConnection == null) {
          databaseConnection = await connectTenant(databaseCredential, true);
        }

        await this.updateUser(databaseConnection, accessData, userUID);

      } catch (error) {
        //Se der ruim na conexão com tenant tem que ver oque faz
        throw new Error("Error to register client on tenants. Details: " + error);
      }
    }

    const getDefaultTenantConnectionUseCase: GetDefaultTenantConnectionUseCase = new GetDefaultTenantConnectionUseCase();
    const defaultTenantConnection = await getDefaultTenantConnectionUseCase.execute();

    if(defaultTenantConnection != null){
      try {
        await this.updateUser(defaultTenantConnection, accessData, userUID);
      } catch (error) {
        throw new Error("Error to register client on default tenant. Details: " + error);
      }
    }

    return true;
  }


  async updateUser(tenantConnection: TenantConnection, accessData: any, userUID: string): Promise<void>{
    const userRepository: UserRepository = new UserRepository(tenantConnection);

    //Busca usuário
    let user: User | null = await userRepository.findOne({ UID: userUID });
    //verificar se a aplicação tem outro usuário
    const isUserRegistered = await userRepository.isUserRegistered();

    let _isAdministrator: boolean = false;

    if(isUserRegistered == false){
      _isAdministrator = true;
    }

    if (user == null) {
      user = await userRepository.create(new User({
        UID: accessData.UID,//UID do servidor de identidade
        userName: accessData.userName,
        firstName: accessData.firstName,
        lastName: accessData.lastName,
        isAdministrator: _isAdministrator,
        email: accessData.email,
        tenantUID: "test" //TODO é necessário esse campo?
      }));
    } else {
      //Atualiza os dados de usuário que estão no servidor de identidade para o banco de dados de uso
      user = await userRepository.update(
        user.id!,
        {
          UID: accessData.UID,//UID do servidor de identidade
          userName: accessData.userName,
          firstName: accessData.firstName,
          lastName: accessData.lastName,
          email: accessData.email,
          tenantUID: "test" //TODO é necessário esse campo?
        }
      );
    }

  }
}
