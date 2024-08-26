import { Sequelize, ModelStatic } from "sequelize";
import userModel from "./user.model";
import roleModel from "./role.model";
import userRoleModel from "./userRole.model";
import functionSystemModel from "./functionSystem.model";
import functionSystemRoleModel from "./functionSystemRole.model";
import componentStructureModel from "./componentStructure.model";
import componentStructureRoleModel from "./componentStructureRole.model";

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

  //Relação de muitos pra muitos de User para Role
  user.belongsToMany(role, {through: userRole});
  role.belongsToMany(user, {through: userRole});

  //Relação de muitos pra muitos entre Role e FunctionsSystem
  role.belongsToMany(functionSystem, { through: functionSystemRole });
  functionSystem.belongsToMany(role, { through: functionSystemRole });

  //Relação de muitos para muitos entre ComponentStructure e Role
  componentStructure.belongsToMany(role, {through: componentStructureRole});
  role.belongsToMany(componentStructure, {through: componentStructureRole});

  //TODO precisará ser gerado várias linhas como essa abaixo, com o model diferente

  const models = {
    user,
    role,
    userRole,
    functionSystem,
    functionSystemRole,
    componentStructure,
    componentStructureRole
    //Precisará ser gerado aqui os nomes das variáveis de cada model
  }
  return models;
}