import { Application } from 'express';
import nfUserRoutes from './fixes/user.route';
import nfTenantRoutes from './fixes/tenant.route';
import nfRoleRoutes from './fixes/role.route';
import nfDatabaseCredentialRoutes from './fixes/databaseCredential.route';
import nfDatabasePermissionRoutes from './fixes/databasePermission.route';
import nfTenantDirectoryRoutes from './fixes/tenantDirectory.route';
import nfApplicationRoutes from './fixes/application.route';
import nfFileRoutes from './fixes/file.route';
import nfFieldFileRoutes from './fixes/fieldFile.route';
import nfAuthenticationRoutes from './fixes/authentication.route';
import nfMenuRoutes from './fixes/menu.route';
/** 
 * Define as rotas da aplicação 
 * @param app Instância do aplicação Express 
 */ 
export function setRoutes(app: Application) { 

  nfRoleRoutes(app); 
  nfUserRoutes(app);
  nfTenantRoutes(app);
  nfDatabaseCredentialRoutes(app);
  nfDatabasePermissionRoutes(app);
  nfTenantDirectoryRoutes(app);
  nfApplicationRoutes(app);
  nfFileRoutes(app);
  nfFieldFileRoutes(app);
  nfAuthenticationRoutes(app);
  nfMenuRoutes(app);

}
