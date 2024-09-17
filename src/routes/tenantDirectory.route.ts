import { Application, Router } from 'express';
import validateHeaders from './validators/index.validator';
import changeTenant from '../middlewares/tenant.middleware';
import { verifyAccess } from '../middlewares/auth.middleware';
import { TenantDirectoryController } from '../controllers/tenantDirectory.controller';

/**
 * Define as rotas relacionadas ao diretório do tenant
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: TenantDirectoryController = new TenantDirectoryController();
  const router: Router = Router();

  // Rota para obter o domínio do tenant
  router.get('/domain', controller.getTenantDomain);

  app.use('/api/tenantDirectory', router);
}
