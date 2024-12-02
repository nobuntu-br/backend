import { Sequelize, ModelStatic } from "sequelize";
import userModel from "./user.model";
import roleModel from "./role.model";
import userRoleModel from "./userRole.model";
import functionSystemModel from "./functionSystem.model";
import functionSystemRoleModel from "./functionSystemRole.model";
import componentStructureModel from "./componentStructure.model";
import componentStructureRoleModel from "./componentStructureRole.model";
import verificationEmailModel from "./verificationEmail.model";
/**
 * Define os modelos que serão usados pelos usuários da aplicação
 * @param sequelize Instância da conexão com o banco de dados usando a biblioteca sequelize
 * @returns retorna os modelos do banco de dados para ser usado suas operações
 */
export default async function setModels(sequelize: Sequelize) {

  const user = userModel(sequelize);
  const role = roleModel(sequelize);
  const userRole = userRoleModel(sequelize);
  const functionSystem = functionSystemModel(sequelize);
  const functionSystemRole = functionSystemRoleModel(sequelize);
  const componentStructure = componentStructureModel(sequelize);
  const componentStructureRole = componentStructureRoleModel(sequelize);
  const verificationEmail = verificationEmailModel(sequelize);

  //Relação de muitos pra muitos de User para Role
  user.belongsToMany(role, {through: userRole, foreignKey: "userId", otherKey: "roleId"});
  role.belongsToMany(user, {through: userRole, foreignKey: "roleId", otherKey: "userId"});

  //Relação para o controle de acesso as rotas
  // role.hasOne(functionSystemRole, {foreignKey: "roleId"});
  // functionSystemRole.belongsTo(role, {foreignKey: "roleId"});

  // functionSystem.hasOne(functionSystemRole, {foreignKey: "functionSystemId"});
  // functionSystemRole.belongsTo(functionSystem, {foreignKey: "functionSystemId"});

  role.belongsToMany(functionSystem, {through: functionSystemRole, foreignKey: "roleId", otherKey: "functionSystemId"});
  functionSystem.belongsToMany(role, {through: functionSystemRole, foreignKey: "functionSystemId", otherKey: "roleId"});

  //Relação de muitos para muitos entre ComponentStructure e Role
  componentStructure.belongsToMany(role, {through: componentStructureRole, foreignKey: "componentStructureId", otherKey: "roleId"});
  role.belongsToMany(componentStructure, {through: componentStructureRole, foreignKey: "roleId", otherKey: "componentStructureId"});

  //TODO precisará ser gerado várias linhas como essa abaixo, com o model diferente
  await sequelize.sync();
  
  const models = new Map<string, any>();
  
  models.set('User', user);
  models.set('Role', role);
  models.set('UserRole', userRole);
  models.set('FunctionSystem', functionSystem);
  models.set('FunctionSystemRole', functionSystemRole);
  models.set('ComponentStructure', componentStructure);
  models.set('ComponentStructureRole', componentStructureRole);
  models.set('VerificationEmail', verificationEmail);

  //Precisará ser gerado aqui os nomes das variáveis de cada model

  // const models = {
  //   user,
  //   role,
  //   userRole,
  //   functionSystem,
  //   functionSystemRole,
  //   componentStructure,
  //   componentStructureRole,
  //   verificationEmail
  //   //Precisará ser gerado aqui os nomes das variáveis de cada model
  // }
  return models;
}