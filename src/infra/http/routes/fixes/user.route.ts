import { Application, Router } from 'express';
import { UserController } from '../../controllers/fixes/user.controller';
import { checkUserAccess } from '../../middlewares/checkUserAccess.middleware';
import { getSecurityTenant } from '../../middlewares/tenant.middleware';
import validateHeaders from '../../validators/fixes/index.validator';
import { findUserByUIDValidator } from '../../validators/fixes/tenant.validator';
import { findAllUserValidator } from '../../validators/fixes/user.validator';


/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: UserController = new UserController();
  const router: Router = Router();

  router.get('/get-user-profile-photo/:id', controller.getUserProfilePhoto);

  router.get('/get-user-groups', controller.getUserGroups);

  //Criar novo usuário para salvar no banco de dados de alguma empresa
  router.post('/client/signup', [checkUserAccess], controller.createUserForSpecificTenant);

  //Find all
  router.get('/', [getSecurityTenant, ...findAllUserValidator, validateHeaders], controller.findAll);
  //Find count
  router.get('/count', controller.getCount);
  //Find one
  router.get('/uid/:UID', [getSecurityTenant, ...findUserByUIDValidator, validateHeaders], controller.findByUID)
  //Find by id
  router.get('/:id', controller.findById);
  //Update
  router.put('/:id', controller.update);
  //Delete all
  router.delete('/all', controller.deleteAll);
  //Delete
  router.delete('/:id', controller.delete);

  app.use('/api/user', router);
} 
