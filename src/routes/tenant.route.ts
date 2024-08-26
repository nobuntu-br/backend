import { Application, Router } from 'express';
import { TenantController } from '../controllers/tenant.controller';
import { createNewTenantValidator, findAllTenantValidator } from './validators/tenant.validator';
import validateHeaders from './validators/index.validator';
import { getSecurityTenant } from '../middlewares/tenant.middleware';

/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: TenantController = new TenantController();
  const router: Router = Router();

  //Create a new
  router.post('/', [getSecurityTenant, ...createNewTenantValidator, validateHeaders], controller.create);
  //Find all
  router.get('/', [getSecurityTenant, ...findAllTenantValidator, validateHeaders], controller.findAll);
  //Find count
  router.get('/count', [getSecurityTenant, validateHeaders], controller.getCount);
  //Find by UserUID
  router.get('/uid/:UID', [getSecurityTenant, validateHeaders], controller.findByUserUID);
  //Find by id
  router.get('/:id', controller.findById);
  //Update
  router.put('/:id', controller.update);
  //Delete all
  router.delete('/all', controller.deleteAll);
  //Delete
  router.delete('/:id', controller.delete);

  app.use('/api/tenant', router);
} 
