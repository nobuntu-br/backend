import { Application, Router } from 'express';
import { AuthenticationController } from '../../controllers/fixes/authentication.controller';
import { signInRateLimiter } from '../../middlewares/signInRateLimiter.middleware';
import { getSecurityTenant } from '../../middlewares/tenant.middleware';
import { sendPasswordResetLintToEmailValidator, resetPasswordValidator } from '../../validators/fixes/authentication.validator';
import validateHeaders from '../../validators/fixes/index.validator';
import { createNewUserValidator, signinValidator, sendVerificationEmailCodeValidator, validateVerificationEmailCodeValidator, inviteUserValidator, checkEmailExistValidator } from '../../validators/fixes/user.validator';

/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: AuthenticationController = new AuthenticationController();
  const router: Router = Router();

  router.post('/signup', [getSecurityTenant, ...createNewUserValidator, validateHeaders], controller.signUp);

  router.post('/signin', [getSecurityTenant, signInRateLimiter, ...signinValidator, validateHeaders], controller.signIn);

  router.post('/signout', controller.signOut);

  router.get('/refresh-token', controller.refreshToken);

  router.get('/single-sign-on', [getSecurityTenant], controller.singleSignOn);

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
