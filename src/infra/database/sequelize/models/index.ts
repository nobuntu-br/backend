import { ModelStatic, Sequelize } from "sequelize"; 
import nfUserModel from "./fixes/user.model";
import nfRoleModel from "./fixes/role.model";
import nfUserRoleModel from "./fixes/userRole.model";
import nfFunctionSystemModel from "./fixes/functionSystem.model";
import nfFunctionSystemRoleModel from "./fixes/functionSystemRole.model";
import nfComponentStructureModel from "./fixes/componentStructure.model";
import nfComponentStructureRoleModel from "./fixes/componentStructureRole.model";
import nfFileModel from "./fixes/file.model";
import nfFieldFileModel from "./fixes/fieldFile.model";
import nfVerificationEmailModel from "./fixes/verificationEmail.model";
import nfMenuModel from "./fixes/menu.model";
import nfMenuItemModel from "./fixes/menuItem.model";
import nfMenuConfigModel from "./fixes/menuConfig.model";
import nfRoleMenuModel from "./fixes/roleMenu.model";
import TenantConnection from "../../../../domain/entities/fixes/tenantConnection.model";

export default async function setModels(tenantConnection: TenantConnection) { 
  const sequelizeConnection = tenantConnection.connection; 

  if(sequelizeConnection instanceof Sequelize == false){ 
    throw new Error("Instance of database connection is incompatible with setModels function on sequelize."); 
  } 

  const nfUser = nfUserModel(sequelizeConnection); 
  const nfRole = nfRoleModel(sequelizeConnection); 
  const nfUserRole = nfUserRoleModel(sequelizeConnection); 
  const nfFunctionSystem = nfFunctionSystemModel(sequelizeConnection); 
  const nfFunctionSystemRole = nfFunctionSystemRoleModel(sequelizeConnection); 
  const nfComponentStructure = nfComponentStructureModel(sequelizeConnection); 
  const nfComponentStructureRole = nfComponentStructureRoleModel(sequelizeConnection); 
  const nfFile = nfFileModel(sequelizeConnection); 
  const nfFieldFile = nfFieldFileModel(sequelizeConnection); 
  const nfVerificationEmail = nfVerificationEmailModel(sequelizeConnection); 
  const nfMenu = nfMenuModel(sequelizeConnection); 
  const nfMenuItem = nfMenuItemModel(sequelizeConnection); 
  const nfMenuConfig = nfMenuConfigModel(sequelizeConnection); 
  const nfRoleMenu = nfRoleMenuModel(sequelizeConnection); 

  // Relação de um para um de nfFieldFile para nfUser com chave em nfFieldFile 
  nfUser.hasOne(nfFieldFile, {foreignKey: "user", as: "ALIASnfUserALIASnfFieldFileALIAS"}); 
  nfFieldFile.belongsTo(nfUser, {foreignKey: "user", as: "ALIASnfUserALIASnfFieldFileALIAS"}); 

  // Relação de um para muitos de nfFieldFile para nfFile 
  nfFieldFile.hasMany(nfFile, {foreignKey: "fieldFile", as: "ALIASnfFilesALIASnfFieldFileALIAS", onDelete: 'CASCADE'});  

  // Relação de muitos pra muitos de nfUser para nfRole 
  nfUser.belongsToMany(nfRole, {through: nfUserRole, foreignKey: "userId", otherKey: "roleId"}); 
  nfRole.belongsToMany(nfUser, {through: nfUserRole, foreignKey: "roleId", otherKey: "userId"}); 

  // Relação de muitos pra muitos entre nfRole e nfFunctionSystem 
  nfRole.belongsToMany(nfFunctionSystem, {through: nfFunctionSystemRole, foreignKey: "roleId", otherKey: "functionSystemId", as: "functionSystem",});

  nfFunctionSystem.belongsToMany(nfRole, {through: nfFunctionSystemRole, foreignKey: "functionSystemId", otherKey: "roleId", as: "role"});

  // Relação de muitos para muitos entre nfComponentStructure e nfRole 
  nfComponentStructure.belongsToMany(nfRole, {through: nfComponentStructureRole, foreignKey: "componentStructureId", otherKey: "roleId"}); 
  nfRole.belongsToMany(nfComponentStructure, {through: nfComponentStructureRole, foreignKey: "roleId", otherKey: "componentStructureId"}); 

  // Relação para o nfMenu 
  nfMenu.hasMany(nfMenuItem, { foreignKey: "menuId" }); 
  nfMenuItem.belongsTo(nfMenu, { foreignKey: "menuId", as: "menu" }); 

  nfMenuConfig.hasOne(nfMenu, { foreignKey: "menuConfigId" }); 
  nfMenu.belongsTo(nfMenuConfig, { foreignKey: "menuConfigId", as: "menuConfig" }); 

  nfMenuItem.hasMany(nfMenuItem, { foreignKey: "subMenuId" }); 
  nfMenuItem.belongsTo(nfMenuItem, { foreignKey: "subMenuId", as: "subMenu" }); 

  nfRole.belongsToMany(nfMenu, { 
    through: nfRoleMenu, 
    as: 'menus', 
    foreignKey: 'roleId', 
    otherKey: 'menuId' 
  }); 

  nfMenu.belongsToMany(nfRole, { 
    through: nfRoleMenu, 
    as: 'roles', 
    foreignKey: 'menuId', 
    otherKey: 'roleId' 
  }); 

  await sequelizeConnection.sync({ alter: true }).then(() => { 
    console.log("Banco de dados sincronizado"); 
  }).catch((error) => { 
    console.log("Erro ao sincronizar o banco de dados"); 
  }); 

  const models = new Map<string, any>(); 

  models.set('nfUser', nfUser); 
  models.set('nfRole', nfRole); 
  // Models de controle de acesso às rotas
  models.set('nfUserRole', nfUserRole); 
  models.set('nfFunctionSystem', nfFunctionSystem); 
  models.set('nfFunctionSystemRole', nfFunctionSystemRole); 
  // Models de controle de acesso ao ambiente 
  models.set('nfComponentStructure', nfComponentStructure); 
  models.set('nfComponentStructureRole', nfComponentStructureRole); 
  models.set('nfVerificationEmail', nfVerificationEmail); 
  // Models de arquivos 
  models.set('nfFile', nfFile); 
  models.set('nfFieldFile', nfFieldFile); 
  // Models de menu 
  models.set('nfMenu', nfMenu); 
  models.set('nfMenuItem', nfMenuItem); 
  models.set('nfMenuConfig', nfMenuConfig); 
  models.set('nfRoleMenu', nfRoleMenu); 
  // Modelos do projeto


  return models; 
} 
