import { Application } from 'express';
import userRoutes from './user.route';
import tenantRoutes from './tenant.route';
import roleRoutes from './role.route';
import databaseCredentialRoutes from './databaseCredential.route';
import databasePermissionRoutes from './databasePermission.route'; 
//TODO Essas importações precisarão ser geradas
import tenantDirectoryRoutes from './tenantDirectory.route'
import applicationRoutes from './application.route';
import orderRoutes from './order.route';
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

  databaseCredentialRoutes(app);

  tenantRoutes(app);

  databasePermissionRoutes(app);

  applicationRoutes(app);

  tenantDirectoryRoutes(app);

  //TODO serão gerados esses segmentos pelo mapper

  orderRoutes(app);

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

}
