import { Sequelize, ModelStatic } from "sequelize";
import userModel from "./user.model";
import roleModel from "./role.model";
import userRoleModel from "./userRole.model";
import functionSystemModel from "./functionSystem.model";
import functionSystemRoleModel from "./functionSystemRole.model";
import componentStructureModel from "./componentStructure.model";
import componentStructureRoleModel from "./componentStructureRole.model";
import verificationEmailModel from "./verificationEmail.model";
import TenantConnection from "../../../../domain/entities/tenantConnection.model";
/**
 * Define os modelos que serão usados pelos usuários da aplicação
 * @param tenantConnection Instância da conexão com o banco de dados usando a biblioteca sequelize
 * @returns retorna os modelos do banco de dados para ser usado suas operações
 */
export default async function setModels(tenantConnection: TenantConnection) {
  const sequelizeConnection = tenantConnection.connection;

  if(sequelizeConnection instanceof Sequelize == false){
    throw new Error("Instance of database connection is incompatible with setModels function on sequelize.");
  }

  const user = userModel(sequelizeConnection);
  const role = roleModel(sequelizeConnection);
  const userRole = userRoleModel(sequelizeConnection);
  const functionSystem = functionSystemModel(sequelizeConnection);
  const functionSystemRole = functionSystemRoleModel(sequelizeConnection);
  const componentStructure = componentStructureModel(sequelizeConnection);
  const componentStructureRole = componentStructureRoleModel(sequelizeConnection);
  const verificationEmail = verificationEmailModel(sequelizeConnection);

  //Relação de muitos pra muitos de User para Role
  user.belongsToMany(role, {through: userRole, foreignKey: "userId", otherKey: "roleId"});
  role.belongsToMany(user, {through: userRole, foreignKey: "roleId", otherKey: "userId"});

  role.belongsToMany(functionSystem, {through: functionSystemRole, foreignKey: "roleId", otherKey: "functionSystemId"});
  functionSystem.belongsToMany(role, {through: functionSystemRole, foreignKey: "functionSystemId", otherKey: "roleId"});

  //Relação de muitos para muitos entre ComponentStructure e Role
  componentStructure.belongsToMany(role, {through: componentStructureRole, foreignKey: "componentStructureId", otherKey: "roleId"});
  role.belongsToMany(componentStructure, {through: componentStructureRole, foreignKey: "roleId", otherKey: "componentStructureId"});

  //TODO precisará ser gerado várias linhas como essa abaixo, com o model diferente
  await sequelizeConnection.sync();
  
  const models = new Map<string, any>();
  
  models.set('User', user);
  models.set('Role', role);
  //Models de controle de acesso as rotas
  models.set('UserRole', userRole);
  models.set('FunctionSystem', functionSystem);
  models.set('FunctionSystemRole', functionSystemRole);
  //Models de controle de acesso a ambiente
  models.set('ComponentStructure', componentStructure);
  models.set('ComponentStructureRole', componentStructureRole);
  models.set('VerificationEmail', verificationEmail);

  //Precisará ser gerado aqui os nomes das variáveis de cada model
  return models;
}