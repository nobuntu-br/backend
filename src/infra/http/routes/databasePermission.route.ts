import { Application, Router } from 'express';
import validateHeaders from '../validators/index.validator';
import { getSecurityTenant } from '../middlewares/tenant.middleware';
import { createNewDatabasePermissionValidator, findAllDatabasePermissionValidator } from '../validators/databasePermission.validator';
import { DatabasePermissionController } from '../controllers/databasePermission.controller';

/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: DatabasePermissionController = new DatabasePermissionController();
  const router: Router = Router();

  //Create a new Tenant permission
  router.post('/', [getSecurityTenant, ...createNewDatabasePermissionValidator, validateHeaders], controller.create);
  //Remove a tenant permission
  router.delete('/', [getSecurityTenant], controller.delete);
  //Update tenant admin
  router.put('/', [getSecurityTenant], controller.update);

  //Find all
  router.get('/', [getSecurityTenant, ...findAllDatabasePermissionValidator, validateHeaders], controller.findAll);
  //Find count
  router.get('/count', [getSecurityTenant], controller.getCount);
  //Find one
  router.get('/:id', [getSecurityTenant], controller.findById);
  //Delete

  app.use('/api/database-permission', router);
} 
