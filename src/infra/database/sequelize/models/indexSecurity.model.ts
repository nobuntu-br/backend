import { Sequelize } from "sequelize";

//TODO precisará ser gerada as importações
import userModel from "./user.model";
import roleModel from "./role.model";
import userRoleModel from "./userRole.model";
import functionSystemModel from "./functionSystem.model";
import functionSystemRoleModel from "./functionSystemRole.model";
import tenantModel from "./tenant.model";
import databasePermissionModel from "./databasePermission.model";
import databaseCredentialModel from "./databaseCredential.model";
import verificationEmailModel from "./verificationEmail.model";
import TenantConnection from "../../../../domain/entities/tenantConnection.model";
/**
 * Define os modelos do banco de dados que serão usados pela parte de controle de acesso aos tenants 
 * @param sequelizeConnection Instância da conexão com o banco de dados usando a biblioteca sequelize
 * @returns retorna os modelos do banco de dados para ser usado suas operações
 */
export default async function setModels(tenantConnection: TenantConnection) {
  const sequelizeConnection = tenantConnection.connection;

  if (sequelizeConnection instanceof Sequelize == false) {
    throw new Error("Instance of database connection is incompatible with setModels function on sequelize.");
  }

  const user = userModel(sequelizeConnection);
  const role = roleModel(sequelizeConnection);
  const userRole = userRoleModel(sequelizeConnection);
  const functionSystem = functionSystemModel(sequelizeConnection);
  const functionSystemRole = functionSystemRoleModel(sequelizeConnection);
  const tenant = tenantModel(sequelizeConnection);
  const databasePermission = databasePermissionModel(sequelizeConnection);
  const databaseCredential = databaseCredentialModel(sequelizeConnection);
  const verificationEmail = verificationEmailModel(sequelizeConnection);

  //Relação
  user.hasOne(databasePermission, { foreignKey: "userId" });
  databasePermission.belongsTo(user, { foreignKey: "userId", as: "user"});

  tenant.hasOne(databasePermission, { foreignKey: "tenantId" });
  databasePermission.belongsTo(tenant, { foreignKey: "tenantId",  as: "tenant" });

  databaseCredential.hasOne(databasePermission, { foreignKey: "databaseCredentialId" });
  databasePermission.belongsTo(databaseCredential, { foreignKey: "databaseCredentialId",  as: "databaseCredential"});

  user.belongsToMany(role, { through: userRole, foreignKey: "userId", otherKey: "roleId" });
  role.belongsToMany(user, { through: userRole, foreignKey: "roleId", otherKey: "userId" });

  //Relação para o controle de acesso as rotas
  role.belongsToMany(functionSystem, { through: functionSystemRole, foreignKey: "roleId", otherKey: "functionSystemId" });
  functionSystem.belongsToMany(role, { through: functionSystemRole, foreignKey: "functionSystemId", otherKey: "roleId" });

  user.hasOne(tenant, { foreignKey: "userId" });
  tenant.belongsTo(user, { foreignKey: "userId", as: "user"});
  //Cria as tabelas no banco de dados
  await sequelizeConnection.sync({ alter: true }).then(() => {
    console.log("Banco de dados sincronizado");
  }).catch((error) => {
    console.log("Erro ao sincronizar o banco de dados");
  });

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

  return models;
}
