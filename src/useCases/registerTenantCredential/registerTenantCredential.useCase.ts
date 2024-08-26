import { TenantCredentialService } from '../../services/tenantCredential.service';
import { TenantCredential } from '../../models/tenantCredential.model';
import { buildMongoDBURI, buildPostgresURI, connectToDatabase } from '../../adapters/database.config';
import { DbType } from '../../adapters/createDb.adapter';

export class RegisterTenantCredentialUseCase {
  constructor(private tenantCredentialService: TenantCredentialService) { }

  async execute(tenantCredential: TenantCredential): Promise<TenantCredential | Error> {

    try {
      var _databaseType: DbType;
      var _uri: string;

      if (tenantCredential.dbType === "mongodb") {
        _databaseType = 'mongodb';
        _uri = buildMongoDBURI(tenantCredential);
      } else {
        _databaseType = 'postgres';
        _uri = buildPostgresURI(tenantCredential);
      }

      await connectToDatabase(
        _databaseType,
        _uri,
        false
      );

      return await this.tenantCredentialService.create(tenantCredential);

    } catch (error) {
      return Error("Erro ao conectar com o banco de dados");
    }

  }

  
}
