import { Connection, Model, Mongoose } from "mongoose";
import userModel from "./fixes/user.model";
import roleModel from "./fixes/role.model";
import functionSystemModel from "./fixes/functionSystem.model";
import functionSystemRoleModel from "./fixes/functionSystemRole.model";
import userRoleModel from "./fixes/userRole.model";
import tenantModel from "./fixes/tenant.model";
import databaseCredentialModel from "./fixes/databaseCredential.model";
import databasePermissionModel from "./fixes/databasePermission.model";
import verificationEmailModel from "./fixes/verificationEmail.model";
import counterModel from "./fixes/counter.model";
import TenantConnection from "../../../../domain/entities/fixes/tenantConnection.model";

export default async function setModels(tenantConnection: TenantConnection) {
  const mongooseConnection = tenantConnection.connection;


  if(mongooseConnection instanceof Connection == false){
    throw new Error("Instance of database connection is incompatible with setModels function on mongoose.");
  }

  const user = userModel(mongooseConnection);//Tabela com os usuários que usam os tenants
  const role = roleModel(mongooseConnection);
  const userRole = userRoleModel(mongooseConnection);
  const functionSystem = functionSystemModel(mongooseConnection);
  const functionSystemRole = functionSystemRoleModel(mongooseConnection);
  const tenant = tenantModel(mongooseConnection);//Tabela com tenants
  const databaseCredential = databaseCredentialModel(mongooseConnection);
  const databasePermission = databasePermissionModel(mongooseConnection);//Tabela intermediária que informa o acesso de cada usuário para cada tenant usando uma credencial
  const verificationEmail = verificationEmailModel(mongooseConnection);
  const counter = counterModel(mongooseConnection);

  const models = new Map<string, any>();
  
  models.set('User', user);
  models.set('Role', role);
  //Models de controle de acesso as rotas
  models.set('UserRole', userRole);
  models.set('FunctionSystem', functionSystem);
  models.set('FunctionSystemRole', functionSystemRole);
  //Models de controle de acesso a banco de dados
  models.set('Tenant', tenant);
  models.set('DatabasePermission', databasePermission);
  models.set('DatabaseCredential', databaseCredential);

  models.set('VerificationEmail', verificationEmail);
  models.set('Counter', counter);

  return models;
}