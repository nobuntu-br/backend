import { Application, Router } from 'express';
import { TenantController } from '../controllers/tenant.controller';
import { createNewTenantValidator, findAllTenantValidator, inviteUserToTenant, removeUserAccessToTenant } from '../validators/tenant.validator';
import validateHeaders from '../validators/index.validator';
import { checkUserAccess } from '../middlewares/checkUserAccess.middleware';
import { getSecurityTenant } from '../middlewares/tenant.middleware';
import { verifyAccess } from '../middlewares/auth.middleware';

/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: TenantController = new TenantController();
  const router: Router = Router();

  router.post('/invite-user-to-tenant', [checkUserAccess, ...inviteUserToTenant, validateHeaders], controller.inviteUserToTenant);

  router.post('/remove-user-access-to-tenant', [checkUserAccess, ...removeUserAccessToTenant, validateHeaders], controller.removeUserAccessToTenant);

  router.get('/database-type', [checkUserAccess], controller.getDatabaseType);
  //Get tenant user is admin
  router.get('/isAdmin/uid/:userUID', [getSecurityTenant], controller.findTenantsUserIsAdmin);
  //Create a new
  router.post('/', [getSecurityTenant, ...createNewTenantValidator, validateHeaders], controller.create);
  //Find all
  router.get('/', [ getSecurityTenant, ...findAllTenantValidator, validateHeaders], controller.findAll);
  //Find count
  router.get('/count', [getSecurityTenant, validateHeaders], controller.getCount);
  //Find Tenant by UserUID
  router.get('/uid/:UID', [verifyAccess, getSecurityTenant, validateHeaders], controller.findByUserUID);
  //Find by id
  router.get('/:id', [getSecurityTenant], controller.findById);
  //Update
  router.put('/:id', [getSecurityTenant], controller.update);
  //Delete all
  router.delete('/all', [checkUserAccess, getSecurityTenant], controller.deleteAll);
  //Delete
  router.delete('/:id', [checkUserAccess, getSecurityTenant], controller.delete);

  app.use('/api/tenant', router);
} 
