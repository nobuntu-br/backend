import { Application, Router } from 'express';
import { AuthenticationController } from '../controllers/authentication.controller';
import validateHeaders from './validators/index.validator';
import getUserTenant, { getSecurityTenant } from '../middlewares/tenant.middleware';
import { refreshTokenValidator } from './validators/authentication.validator';
import { changePasswordLinkValidator, changePasswordValidator, checkEmailExistValidator, createNewUserValidator, inviteUserValidator, sendVerificationEmailCodeValidator, signinValidator, validateVerificationEmailCodeValidator } from './validators/user.validator';
import { verifyAccess } from '../middlewares/auth.middleware';

/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: AuthenticationController = new AuthenticationController();
  const router: Router = Router();

  router.post('/signup', [getSecurityTenant, ...createNewUserValidator, validateHeaders], controller.signup);

  router.post('/signin', [getSecurityTenant, ...signinValidator, validateHeaders], controller.signin);

  router.get('/refresh-token', [...refreshTokenValidator, validateHeaders], controller.refreshToken);

  /**
   * Envia código de verificação para email
   */
  router.post('/send-verification-email-code', [getSecurityTenant, ...sendVerificationEmailCodeValidator, validateHeaders], controller.sendVerificationEmailCodeToEmail);

  /**
   * Valida o código de verificação que foi enviado pelo email
   */
  router.post('/validate-verification-email-code', [getSecurityTenant, ...validateVerificationEmailCodeValidator, validateHeaders], controller.validateVerificationEmailCode);

  router.post('/send-password-reset-link-to-email', [getSecurityTenant, ...changePasswordLinkValidator, validateHeaders], controller.sendPasswordResetLinkToEmail);

  router.patch('/change-password', [getSecurityTenant, ...changePasswordValidator, validateHeaders], controller.changePassword);

  router.post('/invite-user', [getSecurityTenant, ...inviteUserValidator, validateHeaders], controller.inviteUser)

  router.post('/check-email-exist', [getSecurityTenant, ...checkEmailExistValidator, validateHeaders], controller.checkEmailExist);

  app.use('/api/authentication', router);
} 
