import { Application, Router } from 'express';
import { TenantCredentialController } from '../controllers/tenantCredential.controller';
import { getSecurityTenant } from '../middlewares/tenant.middleware';

/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: TenantCredentialController = new TenantCredentialController();
  const router: Router = Router();

  //Create a new
  router.post('/', [getSecurityTenant], controller.create);
  //Find all
  router.get('/', [getSecurityTenant], controller.findAll);
  //Find count
  router.get('/count', controller.getCount);
  //Find by id
  router.get('/:id', controller.findById);
  //Update
  router.put('/:id', controller.update);
  //Delete all
  router.delete('/all', controller.deleteAll);
  //Delete
  router.delete('/:id', controller.delete);

  app.use('/api/tenantCredential', router);
} 