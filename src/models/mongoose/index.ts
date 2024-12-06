import { Connection, Mongoose } from "mongoose";

//TODO precisará ser gerada as importações
import userModel from "./user.model";
import roleModel from "./role.model";
import orderModel from "./order.model";
import functionSystemModel from "./functionSystem.model";
import functionSystemRoleModel from "./functionSystemRole.model";
import userRoleModel from "./userRole.model";
import componentStructureModel from "./componentStructure.model";
import componentStructureRoleModel from "./componentStructureRole.model";
import verificationEmailModel from "./verificationEmail.model";
import TenantConnection from "../tenantConnection.model";

/**
 * Define os modelos que serão usados pelos usuários da aplicação
 * @param tenantConnection Instância da conexão tenant
 * @returns retorna os modelos do banco de dados para ser usado suas operações
 */
export default async function setModels(tenantConnection: TenantConnection) {
  const mongooseConnection = tenantConnection.connection;

  if(mongooseConnection instanceof Connection == false){
    throw new Error("Instance of database connection is incompatible with setModels function on mongoose.");
  }

  const order = orderModel(mongooseConnection);
  const user = userModel(mongooseConnection);
  const role = roleModel(mongooseConnection);
  const userRole = userRoleModel(mongooseConnection);
  const functionSystem = functionSystemModel(mongooseConnection);
  const functionSystemRole = functionSystemRoleModel(mongooseConnection);
  const componentStructure = componentStructureModel(mongooseConnection);
  const componentStructureRole = componentStructureRoleModel(mongooseConnection);
  const verificationEmail = verificationEmailModel(mongooseConnection);

  //TODO precisará ser gerado várias linhas como essa abaixo, com o model diferente

  const models = new Map<string, any>();
  
  models.set('User', user);
  models.set('Role', role);
  models.set('UserRole', userRole);
  models.set('FunctionSystem', functionSystem);
  models.set('FunctionSystemRole', functionSystemRole);
  models.set('ComponentStructure', componentStructure);
  models.set('ComponentStructureRole', componentStructureRole);
  models.set('VerificationEmail', verificationEmail);

  return models;
}