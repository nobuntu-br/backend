import { encryptDatabasePassword } from '../../utils/crypto.util';
import { DatabaseType } from "../../infra/database/createDb.adapter";
import DatabaseCredentialRepository from '../../domain/repositories/databaseCredential.repository';
import { DatabaseCredential } from '../../domain/entities/databaseCredential.model';
import DatabasePermissionRepository from '../../domain/repositories/databasePermission.repository';
import UserRepository from '../../domain/repositories/user.repository';

type RegisterDatabaseCredentialInputDTO = {
  name?: string;
  type: DatabaseType;
  username?: string;
  password?: string;
  host?: string;
  port?: string;
  srvEnabled: boolean; // Indica se usa protocolo SRV (mongodb)
  options?: string;
  storagePath?: string;
  sslEnabled: boolean;
  poolSize?: number;
  timeOutTime?: number;

  //SSL data
  sslCertificateAuthority?: string; //Serve para verificar que o certificado apresentado pelo servidor ou cliente é confiável e foi emitido por uma CA válida.
  sslPrivateKey?: string; //Usada para descriptografar mensagens recebidas e assinar mensagens enviadas. Deve ser mantido em segredo.
  sslCertificate?: string; //Informações públicas, como o domínio, entidade responsável e a CertificateAuthority que o emitiu.

  tenant?: number;
  userUID?: string;
}

export class RegisterDatabaseCredentialUseCase {
  constructor(
    private databaseCredentialRepository: DatabaseCredentialRepository,
    private databasePermissionRepository: DatabasePermissionRepository,
    private userRepository: UserRepository
  ) { }

  async execute(input: RegisterDatabaseCredentialInputDTO): Promise<string | Error> {

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