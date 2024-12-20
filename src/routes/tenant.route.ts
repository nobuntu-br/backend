import { Application, Router } from 'express';
import { TenantController } from '../controllers/tenant.controller';
import { createNewTenantValidator, findAllTenantValidator } from './validators/tenant.validator';
import validateHeaders from './validators/index.validator';
import getUserTenant, { getSecurityTenant } from '../middlewares/tenant.middleware';
import { verifyAccess } from '../middlewares/auth.middleware';

/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: TenantController = new TenantController();
  const router: Router = Router();

  router.get('/database-type', [getUserTenant], controller.getDatabaseType);
  //Get tenant user is admin
  router.get('/isAdmin/uid/:userUID', [getSecurityTenant], controller.findTenantsUserIsAdmin);
  //Create a new
  router.post('/', [getSecurityTenant, ...createNewTenantValidator, validateHeaders], controller.create);
  //Find all
  router.get('/', [verifyAccess, getSecurityTenant, ...findAllTenantValidator, validateHeaders], controller.findAll);
  //Find count
  router.get('/count', [getSecurityTenant, validateHeaders], controller.getCount);
  //Find by UserUID
  router.get('/uid/:UID', [getSecurityTenant, validateHeaders], controller.findByUserUID);
  //Find by id
  router.get('/:id', [getSecurityTenant], controller.findById);
  //Update
  router.put('/:id', [getSecurityTenant], controller.update);
  //Delete all
  router.delete('/all', [verifyAccess, getSecurityTenant], controller.deleteAll);
  //Delete
  router.delete('/:id', [verifyAccess, getSecurityTenant], controller.delete);

  app.use('/api/tenant', router);
} 
