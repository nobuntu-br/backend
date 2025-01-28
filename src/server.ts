import app from './app';
import showTime from './utils/showTime.util';
import { GetDefaultTenantConnectionUseCase } from './useCases/tenant/getDefaultTenantConnection.useCase';
import { GetSecurityTenantConnectionUseCase } from './useCases/tenant/getSecurityTenantConnection.useCase';
import DatabasePermissionService from './domain/services/databasePermission.service';

const PORT = process.env.PORT_SERVER || 8080;

app.listen(PORT, async () => {
  //Realiza conexão no banco de dados de segurança
  const getSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();
  const securityTenant = await getSecurityTenantConnectionUseCase.execute();

  //Realiza conexão no banco de dados padrão
  const getDefaultTenantConnectionUseCase = new GetDefaultTenantConnectionUseCase();
  await getDefaultTenantConnectionUseCase.execute();

  const databasePermissionService: DatabasePermissionService = new DatabasePermissionService(securityTenant);
  //É salvo todas as permissões de acesso a tenant na memória
  databasePermissionService.saveDatabasePermissionsOnMemory();

  showTime();
  console.log(`Servidor está rodando na porta ${PORT}`);
});
