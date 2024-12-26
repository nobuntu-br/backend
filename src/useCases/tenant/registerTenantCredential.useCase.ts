import { encryptDatabasePassword } from '../../utils/crypto.util';
import { DatabaseCredentialInputDTO } from '../../models/DTO/databaseCredential.DTO';
import DatabasePermissionRepository from '../../repositories/databasePermission.repository';
import DatabaseCredentialRepository from '../../repositories/databaseCredential.repository';
import UserRepository from '../../repositories/user.repository';
import { DatabaseCredential } from '../../models/databaseCredential.model';

export class RegisterTenantCredentialUseCase {
  constructor(
    private databaseCredentialRepository: DatabaseCredentialRepository,
    private databasePermissionRepository: DatabasePermissionRepository,
    private userRepository: UserRepository
  ) { }

  async execute(input: DatabaseCredentialInputDTO): Promise<string | Error> {

    try {
      //Verificar se o usuário é válido
      const user = await this.userRepository.findOne({UID: input.userUID});

      //Testa a conexão com as credenciais
      try {
        // const tenantConnection : TenantConnection = await testConnectToDatabase(input);
        //TODO chamar a função de conectar no banco de dados normal e com esse próprio try-catch lidar com o erro ou sucesso
      } catch (error) {
        console.log("Erro a o realizar a conexão com o banco de dados. Detalhes: ", error);
        throw error;
      }

      //TODO Verificar se já pode ser registro repetido


      //Criptografa a senha do tenant
      const encriptedDatabasePassword : string | null = encryptDatabasePassword(input.password!);
      if(encriptedDatabasePassword == null){
        throw new Error("Não foi possível encriptografar senha das novas credenciais de tenant");
      }

      input.password = encriptedDatabasePassword;

      //Registra as credenciais do tenant
      const newTenantCredential = await this.databaseCredentialRepository.create(new DatabaseCredential(input));
      // await this.tenantCredentialService.create(input);

      //Registra o User Tenant
      await this.databasePermissionRepository.create({
        databaseCredential: newTenantCredential.id,
        tenant: input.tenant,
        isAdmin: true,
        user: user!.id,
        userUID: input.userUID,
      });

      //Retornar dados do tenant criado
      return "Tenant Credential created";

    } catch (error) {
      throw error;
    }

  }

}