import { Sequelize } from "sequelize";

//TODO precisará ser gerada as importações
import userModel from "./user.model";
import tenantModel from "./tenant.model";
import databasePermissionModel from "./databasePermission.model";
import databaseCredentialModel from "./databaseCredential.model";
import verificationEmailModel from "./verificationEmail.model";
/**
 * Define os modelos do banco de dados que serão usados pela parte de controle de acesso aos tenants 
 * @param sequelize Instância da conexão com o banco de dados usando a biblioteca sequelize
 * @returns retorna os modelos do banco de dados para ser usado suas operações
 */
export default async function setModels(sequelize: Sequelize) {

  const user = userModel(sequelize);
  const tenant = tenantModel(sequelize);
  const databasePermission = databasePermissionModel(sequelize);
  const databaseCredential = databaseCredentialModel(sequelize);
  const verificationEmail = verificationEmailModel(sequelize);

  //Relação
  user.hasOne(databasePermission, {foreignKey: "userId"});
  databasePermission.belongsTo(user, {foreignKey: "userId"});

  tenant.hasOne(databasePermission, {foreignKey: "tenantId"});
  databasePermission.belongsTo(tenant, {foreignKey: "tenantId"});

  //Cria as tabelas no banco de dados
  await sequelize.sync();

  const models = new Map<string, any>();
  
  models.set('User', user);
  models.set('Tenant', tenant);
  models.set('DatabasePermission', databasePermission);
  models.set('DatabaseCredential', databaseCredential);
  models.set('VerificationEmail', verificationEmail);

  //Precisará ser gerado aqui os nomes das variáveis de cada model

  // const models = {
  //   user,
  //   tenant,
  //   databasePermission,
  //   databaseCredential,
  //   verificationEmail
  //   //Precisará ser gerado aqui os nomes das variáveis de cada model
  // }

  return models;
}