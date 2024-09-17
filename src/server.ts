import { getDefaultTenantConnection } from './adapters/databaseDefault.config';
import { getSecurityTenantConnection } from './adapters/databaseSecurity.config';
import app from './app';
import showTime from './utils/showTime.util';

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  //Realiza conexão no banco de dados de segurança
  await getSecurityTenantConnection();

  //Realiza conexão no banco de dados padrão
  await getDefaultTenantConnection();

  showTime();
  console.log(`Servidor está rodando na porta ${PORT}`);
});
