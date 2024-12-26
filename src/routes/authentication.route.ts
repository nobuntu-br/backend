import { Application, Router } from 'express';
import { AuthenticationController } from '../controllers/authentication.controller';
import validateHeaders from './validators/index.validator';
import getUserTenant, { getSecurityTenant } from '../middlewares/tenant.middleware';
import { refreshTokenValidator, resetPasswordValidator, sendPasswordResetLintToEmailValidator } from './validators/authentication.validator';
import { checkEmailExistValidator, createNewUserValidator, inviteUserValidator, sendVerificationEmailCodeValidator, signinValidator, validateVerificationEmailCodeValidator } from './validators/user.validator';
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

  router.post('/send-password-reset-link-to-email', [getSecurityTenant, ...sendPasswordResetLintToEmailValidator, validateHeaders], controller.sendPasswordResetLinkToEmail);

  router.patch('/reset-password', [getSecurityTenant, ...resetPasswordValidator, validateHeaders], controller.resetPassword);

  router.post('/invite-user', [getSecurityTenant, ...inviteUserValidator, validateHeaders], controller.inviteUser)

  router.post('/check-email-exist', [getSecurityTenant, ...checkEmailExistValidator, validateHeaders], controller.checkEmailExist);

  app.use('/api/authentication', router);
} 
