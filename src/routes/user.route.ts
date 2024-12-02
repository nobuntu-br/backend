import { Application, Router } from 'express';
import validateHeaders from './validators/index.validator';
import { UserController } from '../controllers/user.controller';
import { checkEmailExistValidator, createNewUserValidator, findAllUserValidator, findUserByUIDValidator, changePasswordValidator, sendVerificationEmailCodeValidator, validateVerificationEmailCodeValidator, signinValidator, changePasswordLinkValidator, inviteUserValidator } from './validators/user.validator';
import changeTenant, { getSecurityTenant } from '../middlewares/tenant.middleware';
import { verifyAccess } from '../middlewares/auth.middleware';

/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: UserController = new UserController();
  const router: Router = Router();

  router.post('/signin', [getSecurityTenant, ...signinValidator, validateHeaders], controller.signin);

  router.get('/get-user-image/:id', controller.getUserImage)

  //TODO refreshToken route add

  router.post('/check-email-exist', [getSecurityTenant, ...checkEmailExistValidator, validateHeaders], controller.checkEmailExist);

  router.post('/send-verification-email-code', [getSecurityTenant, ...sendVerificationEmailCodeValidator, validateHeaders], controller.sendVerificationEmailCodeToEmail);

  router.post('/validate-verification-email-code', [getSecurityTenant, ...validateVerificationEmailCodeValidator, validateHeaders], controller.validateVerificationEmailCode);

  //Change user password paths

  router.post('/send-change-password-link', [getSecurityTenant, ...changePasswordLinkValidator, validateHeaders], controller.sendChangeUserPasswordLinkToEmail);

  router.patch('/change-password', [getSecurityTenant, ...changePasswordValidator, validateHeaders], controller.changePassword);
  
  //Create a new User
  router.post('/signup', [getSecurityTenant, ...createNewUserValidator, validateHeaders], controller.create);

  router.post('/invite-user', [getSecurityTenant, ...inviteUserValidator, validateHeaders], controller.inviteUser)

  //Criar novo usuário para salvar no banco de dados de alguma empresa
  router.post('/client/signup', [verifyAccess, changeTenant], controller.createUserForSpecificTenant);

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
