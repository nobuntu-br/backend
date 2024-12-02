import app from './app';
import showTime from './utils/showTime.util';
import { GetDefaultTenantConnectionUseCase } from './useCases/tenant/getDefaultTenantConnection.useCase';
import { GetSecurityTenantConnectionUseCase } from './useCases/tenant/getSecurityTenantConnection.useCase';

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  //Realiza conexão no banco de dados de segurança
  const getSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();
  await getSecurityTenantConnectionUseCase.execute();

  //Realiza conexão no banco de dados padrão
  const getDefaultTenantConnectionUseCase = new GetDefaultTenantConnectionUseCase();
  await getDefaultTenantConnectionUseCase.execute();

  showTime();
  console.log(`Servidor está rodando na porta ${PORT}`);
});
