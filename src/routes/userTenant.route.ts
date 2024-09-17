import { Application, Router } from 'express';
import validateHeaders from './validators/index.validator';
import changeTenant, { getSecurityTenant } from '../middlewares/tenant.middleware';
import { UserTenantController } from '../controllers/userTenant.controller';
import { createNewUserTenantValidator, findAllUserTenantValidator } from './validators/userTenant.validator';

/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: UserTenantController = new UserTenantController();
  const router: Router = Router();

  //Create a new Tenant permission
  router.post('/', [getSecurityTenant, ...createNewUserTenantValidator, validateHeaders], controller.create);
  //Remove a tenant permission
  router.delete('/', [getSecurityTenant], controller.delete);
  //Update tenant admin
  router.put('/', [getSecurityTenant], controller.update);

  //Find all
  router.get('/', [getSecurityTenant, ...findAllUserTenantValidator, validateHeaders], controller.findAll);
  //Find count
  router.get('/count', [getSecurityTenant], controller.getCount);
  //Find one
  router.get('/:id', [getSecurityTenant], controller.findById);
  //Delete

  app.use('/api/userTenant', router);
} 
