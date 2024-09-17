import { TenantCredentialService } from '../../services/tenantCredential.service';
import { ITenantCredential, TenantCredential } from '../../models/tenantCredential.model';
import { testConnectToDatabase } from '../../adapters/testConnectionDatabase.config';
import { encryptDatabasePassword } from '../../utils/crypto.util';
import { ValidationError } from '../../errors/validation.error';

export class RegisterTenantCredentialUseCase {
  constructor(private tenantCredentialService: TenantCredentialService) { }

  async execute(tenantCredential: ITenantCredential): Promise<TenantCredential | Error> {

    try {
      //Testa a conexão com as credenciais
      const isDatabaseConnectionWorks : boolean = await testConnectToDatabase(tenantCredential);

      if(isDatabaseConnectionWorks == false){
        throw new Error("Erro ao realizar a conexão com o banco de dados!");
      }

      //Verificar se já pode ser registro repetido

      //Criptografa a senha do tenant
      const encriptedDatabasePassword : string | null = encryptDatabasePassword(tenantCredential.dbPassword!);
      if(encriptedDatabasePassword == null){
        throw new Error("Não foi possível incriptografara senha das novas credenciais de tenant");
      }

      tenantCredential.dbPassword = encriptedDatabasePassword;

      //Registra as credenciais do tenant
      return await this.tenantCredentialService.create(tenantCredential);

    } catch (error) {
      throw error;
    }

  }

}
