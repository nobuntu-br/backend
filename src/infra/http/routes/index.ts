import { Application } from 'express';
import userRoutes from './user.route';
import authenticationRoutes from './authentication.route';
import tenantRoutes from './tenant.route';
import roleRoutes from './role.route';
import databaseCredentialRoutes from './databaseCredential.route';
import databasePermissionRoutes from './databasePermission.route'; 
import componentStructureRoutes from './componentStructure.route';
//TODO Essas importações precisarão ser geradas
import tenantDirectoryRoutes from './tenantDirectory.route'
import applicationRoutes from './application.route';
/**
 * Define as rotas da aplicação
 * @param app Instância do aplicação Express
 */
export function setRoutes(app: Application) {

  /**
   * Chama função que irá definir quais rotas a aplicação terá
   */
  roleRoutes(app);

  userRoutes(app);

  authenticationRoutes(app);

  databaseCredentialRoutes(app);

  tenantRoutes(app);

  databasePermissionRoutes(app);

  applicationRoutes(app);

  tenantDirectoryRoutes(app);

  componentStructureRoutes(app);

  //TODO serão gerados esses segmentos pelo mapper

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

}
