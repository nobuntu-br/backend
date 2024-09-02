import { Application, Router } from 'express';
import validateHeaders from './validators/index.validator';
import changeUser from '../middlewares/tenant.middleware';
import { verifyAccess } from '../middlewares/auth.middleware';
import { UserDirectoryController } from '../controllers/userDirectory.controller';

/**
 * Define as rotas relacionadas ao diretório de usuários
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: UserDirectoryController = new UserDirectoryController();
  const router: Router = Router();

  // Rota para criar um novo usuário no diretório
  router.post('/create-user', controller.createUserInDirectory);

 // Rota para obter o UserPrincipalName do usuário pelo email
 router.post('/get-user-principal-name', controller.getUserPrincipalName);

 // Rota para alterar a senha do usuário
 router.post('/change-password', controller.changeUserPassword);

 // Rota para editar os detalhes do usuário
 router.put('/edit-user-details', controller.editUserDetails);

  app.use('/api/userDirectory', router);
}
