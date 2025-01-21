import { Application, Router } from 'express';
import { DatabaseCredentialController } from '../controllers/databaseCredential.controller';
import { getSecurityTenant } from '../middlewares/tenant.middleware';
import validateHeaders from '../validators/index.validator';
import { createNewDatabaseCredentialValidator, findAllDatabaseCredentialValidator } from '../validators/databaseCredential.validator';

/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: DatabaseCredentialController = new DatabaseCredentialController();
  const router: Router = Router();

  //Create a new
  router.post('/', [getSecurityTenant, ...createNewDatabaseCredentialValidator, validateHeaders], controller.create);
  //Find all
  router.get('/', [getSecurityTenant, ...findAllDatabaseCredentialValidator, validateHeaders], controller.findAll);
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

  app.use('/api/database-credential', router);
} 
