import { UserDTO } from "../../models/DTO/user.DTO";
import { UserTenantDTO } from "../../models/DTO/userTenant.DTO";
import { User } from "../../models/user.model";
import TenantService from "../../services/tenant.service";
import { TenantCredentialService } from "../../services/tenantCredential.service";
import { UserService } from "../../services/user.service";
import UserTenantService from "../../services/userTenant.service";

export class RegisterUserUseCase {
  constructor(
    private userService: UserService,
    private tenantService: TenantService,
    private tenantCredentialService: TenantCredentialService,
    private userTenantService: UserTenantService
  ) { }

  async execute(user: UserDTO): Promise<User | Error> {
    try {

      //Verifica se usuário já existe
      const isUserExist = await this.userService.findOne(user);
      if (isUserExist != null) {
        throw new Error("Usuário já existe");
      }

      //Cria o usuário
      const newUser: User = await this.userService.create(user);

      const defaultTenantDatabaseId = process.env.DEFAULT_TENANT_DATABASE_ID;

      if (defaultTenantDatabaseId == undefined || newUser == null) {
        console.log("defaulttenant database ID não existe");
        return newUser;
      }

      const defaultTenant = await this.tenantService.findOne({ name: process.env.DEFAULT_TENANT_DATABASE_ID });
      const defaultTenantCredential = await this.tenantCredentialService.findOne({dbName: process.env.DEFAULT_TENANT_DATABASE_ID})

      if(defaultTenant == null || defaultTenantCredential == null){
        console.log("defaulttenant não existe");
        return newUser;
      }

      const userTenant: UserTenantDTO = {
        UserId: newUser.id!,
        TenantId: defaultTenant.id!,
        TenantCredentialId: defaultTenantCredential.id!,
        UserUID: newUser.UID!,
        isAdmin: false,
      }

      console.log("user tenant a ser criado: ", userTenant);
      //Cria o registro na tabela UserTenant associando o usuário com o tenant
      await this.userTenantService.create(userTenant);

      return newUser;
    } catch (error) {
      throw error;
    }
  }
}
