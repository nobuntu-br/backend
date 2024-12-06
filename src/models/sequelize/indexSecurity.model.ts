import { Sequelize } from "sequelize";

//TODO precisará ser gerada as importações
import userModel from "./user.model";
import tenantModel from "./tenant.model";
import databasePermissionModel from "./databasePermission.model";
import databaseCredentialModel from "./databaseCredential.model";
import verificationEmailModel from "./verificationEmail.model";
import TenantConnection from "../tenantConnection.model";
/**
 * Define os modelos do banco de dados que serão usados pela parte de controle de acesso aos tenants 
 * @param sequelizeConnection Instância da conexão com o banco de dados usando a biblioteca sequelize
 * @returns retorna os modelos do banco de dados para ser usado suas operações
 */
export default async function setModels(tenantConnection: TenantConnection) {
  const sequelizeConnection = tenantConnection.connection;

  if(sequelizeConnection instanceof Sequelize == false){
    throw new Error("Instance of database connection is incompatible with setModels function on sequelize.");
  }

  const user = userModel(sequelizeConnection);
  const tenant = tenantModel(sequelizeConnection);
  const databasePermission = databasePermissionModel(sequelizeConnection);
  const databaseCredential = databaseCredentialModel(sequelizeConnection);
  const verificationEmail = verificationEmailModel(sequelizeConnection);

  //Relação
  user.hasOne(databasePermission, {foreignKey: "userId"});
  databasePermission.belongsTo(user, {foreignKey: "userId"});

  tenant.hasOne(databasePermission, {foreignKey: "tenantId"});
  databasePermission.belongsTo(tenant, {foreignKey: "tenantId"});

  //Cria as tabelas no banco de dados
  await sequelizeConnection.sync();

  const models = new Map<string, any>();
  
  models.set('User', user);
  models.set('Tenant', tenant);
  models.set('DatabasePermission', databasePermission);
  models.set('DatabaseCredential', databaseCredential);
  models.set('VerificationEmail', verificationEmail);

  return models;
}