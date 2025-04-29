import { ModelStatic, Sequelize } from "sequelize"; 
import userModel from "./fixes/user.model";
import roleModel from "./fixes/role.model";
import userRoleModel from "./fixes/userRole.model";
import functionSystemModel from "./fixes/functionSystem.model";
import functionSystemRoleModel from "./fixes/functionSystemRole.model";
import componentStructureModel from "./fixes/componentStructure.model";
import componentStructureRoleModel from "./fixes/componentStructureRole.model";
import fileModel from "./fixes/file.model";
import fieldFileModel from "./fixes/fieldFile.model";
import TenantConnection from "../../../../domain/entities/tenantConnection.model";
import verificationEmailModel from "./fixes/verificationEmail.model"; 
import menuModel from "./fixes/menu.model";
import menuItemModel from "./fixes/menuItem.model";
import menuConfigModel from "./fixes/menuConfig.model";
import roleMenuModel from "./fixes/roleMenu.model";

import empreendimentoModel from "./empreendimento.model"; 
import estabelecimentoModel from "./estabelecimento.model"; 
import areaDeNegocioModel from "./areaDeNegocio.model"; 
import planoDeContasModel from "./planoDeContas.model"; 
import centroDeCustoModel from "./centroDeCusto.model"; 
import projetoModel from "./projeto.model"; 
import historicoPadraoModel from "./historicoPadrao.model"; 
import planilhaDoOrcamentoModel from "./planilhaDoOrcamento.model"; 
import estruturaDoOrcamentoModel from "./estruturaDoOrcamento.model"; 
import funcaoDePrevisaoModel from "./funcaoDePrevisao.model"; 
import indicadorModel from "./indicador.model"; 
import registroDeIndicadorModel from "./registroDeIndicador.model"; 
import partidaDoLancamentoModel from "./partidaDoLancamento.model"; 
import usuarioDoEstabelecimentoModel from "./usuarioDoEstabelecimento.model"; 
import tabelaMoedaModel from "./tabelaMoeda.model"; 
import cotacaoMoedaModel from "./cotacaoMoeda.model"; 
import lancamentoContabilModel from "./lancamentoContabil.model"; 

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
  const file = fileModel(sequelizeConnection); 
  const fieldFile = fieldFileModel(sequelizeConnection); 
  const verificationEmail = verificationEmailModel(sequelizeConnection); 
  const menu = menuModel(sequelizeConnection); 
  const menuItem = menuItemModel(sequelizeConnection); 
  const menuConfig = menuConfigModel(sequelizeConnection); 
  const roleMenu = roleMenuModel(sequelizeConnection); 

  //Relação de um para um de fieldFile para user com chave em fielFile 
  user.hasOne(fieldFile, {foreignKey: "user", as: "ALIASuserALIASfieldFileALIAS"}); 
  fieldFile.belongsTo(user, {foreignKey: "user", as: "ALIASuserALIASfieldFileALIAS"}); 

  //Relação de um para muitos de fieldFile para file 
  fieldFile.hasMany(file, {foreignKey: "fieldFile", as: "ALIASfilesALIASfieldFileALIAS", onDelete: 'CASCADE'});  

  //Relação de muitos pra muitos de User para Role 
  user.belongsToMany(role, {through: userRole, foreignKey: "userId", otherKey: "roleId"}); 
  role.belongsToMany(user, {through: userRole, foreignKey: "roleId", otherKey: "userId"}); 

  //Relação de muitos pra muitos entre Role e FunctionsSystem 
  role.belongsToMany(functionSystem, {through: functionSystemRole, foreignKey: "roleId", otherKey: "functionSystemId", as: "functionSystem",});

  functionSystem.belongsToMany(role, {through: functionSystemRole, foreignKey: "functionSystemId", otherKey: "roleId", as: "role"});


  //Relação de muitos para muitos entre ComponentStructure e Role 
  componentStructure.belongsToMany(role, {through: componentStructureRole, foreignKey: "componentStructureId", otherKey: "roleId"}); 
  role.belongsToMany(componentStructure, {through: componentStructureRole, foreignKey: "roleId", otherKey: "componentStructureId"}); 

  //Relação para o menu 
  menu.hasMany(menuItem, { foreignKey: "menuId" }); 
  menuItem.belongsTo(menu, { foreignKey: "menuId", as: "menu" }); 

  menuConfig.hasOne(menu, { foreignKey: "menuConfigId" }); 
  menu.belongsTo(menuConfig, { foreignKey: "menuConfigId", as: "menuConfig" }); 

  menuItem.hasMany(menuItem, { foreignKey: "subMenuId" }); 
  menuItem.belongsTo(menuItem, { foreignKey: "subMenuId", as: "subMenu" }); 

  role.belongsToMany(menu, { 
    through: roleMenu, 
    as: 'menus', 
    foreignKey: 'roleId', 
    otherKey: 'menuId' 
  }); 

  menu.belongsToMany(role, { 
    through: roleMenu, 
    as: 'roles', 
    foreignKey: 'menuId', 
    otherKey: 'roleId' 
  }); 

  const empreendimento = empreendimentoModel(sequelizeConnection); 


  const estabelecimento = estabelecimentoModel(sequelizeConnection); 


  const areaDeNegocio = areaDeNegocioModel(sequelizeConnection); 


  const planoDeContas = planoDeContasModel(sequelizeConnection); 


  const centroDeCusto = centroDeCustoModel(sequelizeConnection); 


  const projeto = projetoModel(sequelizeConnection); 


  const historicoPadrao = historicoPadraoModel(sequelizeConnection); 


  const planilhaDoOrcamento = planilhaDoOrcamentoModel(sequelizeConnection); 


  const estruturaDoOrcamento = estruturaDoOrcamentoModel(sequelizeConnection); 


  const funcaoDePrevisao = funcaoDePrevisaoModel(sequelizeConnection); 


  const indicador = indicadorModel(sequelizeConnection); 


  const registroDeIndicador = registroDeIndicadorModel(sequelizeConnection); 


  const partidaDoLancamento = partidaDoLancamentoModel(sequelizeConnection); 


  const usuarioDoEstabelecimento = usuarioDoEstabelecimentoModel(sequelizeConnection); 


  const tabelaMoeda = tabelaMoedaModel(sequelizeConnection); 


  const cotacaoMoeda = cotacaoMoedaModel(sequelizeConnection); 


  const lancamentoContabil = lancamentoContabilModel(sequelizeConnection); 


  tabelaMoeda.hasOne(empreendimento, {foreignKey: "moedaBase", as: "ALIASmoedaBaseALIASempreendimento"}); 
  empreendimento.belongsTo(tabelaMoeda, {foreignKey: "moedaBase", as: "ALIASmoedaBaseALIASempreendimento"}); 

  empreendimento.hasMany(estabelecimento, {foreignKey: "Empreendimento", as: "ALIASEstabelecimentosALIASempreendimentoALIAS"}); 

  areaDeNegocio.hasOne(estabelecimento, {foreignKey: "areaDeNegocio", as: "ALIASareaDeNegocioALIASestabelecimento"}); 
  estabelecimento.belongsTo(areaDeNegocio, {foreignKey: "areaDeNegocio", as: "ALIASareaDeNegocioALIASestabelecimento"}); 

  empreendimento.hasOne(planoDeContas, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIASplanoDeContas"}); 
  planoDeContas.belongsTo(empreendimento, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIASplanoDeContas"}); 

  empreendimento.hasOne(centroDeCusto, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIAScentroDeCusto"}); 
  centroDeCusto.belongsTo(empreendimento, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIAScentroDeCusto"}); 

  empreendimento.hasOne(projeto, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIASprojeto"}); 
  projeto.belongsTo(empreendimento, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIASprojeto"}); 

  empreendimento.hasOne(historicoPadrao, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIAShistoricoPadrao"}); 
  historicoPadrao.belongsTo(empreendimento, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIAShistoricoPadrao"}); 

  planoDeContas.hasOne(historicoPadrao, {foreignKey: "contaDebito", as: "ALIAScontaDebitoALIAShistoricoPadrao"}); 
  historicoPadrao.belongsTo(planoDeContas, {foreignKey: "contaDebito", as: "ALIAScontaDebitoALIAShistoricoPadrao"}); 

  planoDeContas.hasOne(historicoPadrao, {foreignKey: "contaCredito", as: "ALIAScontaCreditoALIAShistoricoPadrao"}); 
  historicoPadrao.belongsTo(planoDeContas, {foreignKey: "contaCredito", as: "ALIAScontaCreditoALIAShistoricoPadrao"}); 

  estabelecimento.hasOne(planilhaDoOrcamento, {foreignKey: "estabelecimento", as: "ALIASestabelecimentoALIASplanilhaDoOrcamento"}); 
  planilhaDoOrcamento.belongsTo(estabelecimento, {foreignKey: "estabelecimento", as: "ALIASestabelecimentoALIASplanilhaDoOrcamento"}); 

  planilhaDoOrcamento.hasMany(estruturaDoOrcamento, {foreignKey: "PlanilhaDoOrcamento", as: "ALIASEstruturaDoOrcamentoALIASplanilhaDoOrcamentoALIAS"}); 

  funcaoDePrevisao.hasOne(estruturaDoOrcamento, {foreignKey: "funcaoPrevisao", as: "ALIASfuncaoPrevisaoALIASestruturaDoOrcamento"}); 
  estruturaDoOrcamento.belongsTo(funcaoDePrevisao, {foreignKey: "funcaoPrevisao", as: "ALIASfuncaoPrevisaoALIASestruturaDoOrcamento"}); 

  planoDeContas.hasOne(estruturaDoOrcamento, {foreignKey: "contaDebito", as: "ALIAScontaDebitoALIASestruturaDoOrcamento"}); 
  estruturaDoOrcamento.belongsTo(planoDeContas, {foreignKey: "contaDebito", as: "ALIAScontaDebitoALIASestruturaDoOrcamento"}); 

  planoDeContas.hasOne(estruturaDoOrcamento, {foreignKey: "contaCredito", as: "ALIAScontaCreditoALIASestruturaDoOrcamento"}); 
  estruturaDoOrcamento.belongsTo(planoDeContas, {foreignKey: "contaCredito", as: "ALIAScontaCreditoALIASestruturaDoOrcamento"}); 

  historicoPadrao.hasOne(estruturaDoOrcamento, {foreignKey: "historicoPadrao", as: "ALIAShistoricoPadraoALIASestruturaDoOrcamento"}); 
  estruturaDoOrcamento.belongsTo(historicoPadrao, {foreignKey: "historicoPadrao", as: "ALIAShistoricoPadraoALIASestruturaDoOrcamento"}); 

  centroDeCusto.hasOne(estruturaDoOrcamento, {foreignKey: "centroDeCusto", as: "ALIAScentroDeCustoALIASestruturaDoOrcamento"}); 
  estruturaDoOrcamento.belongsTo(centroDeCusto, {foreignKey: "centroDeCusto", as: "ALIAScentroDeCustoALIASestruturaDoOrcamento"}); 

  projeto.hasOne(estruturaDoOrcamento, {foreignKey: "projeto", as: "ALIASprojetoALIASestruturaDoOrcamento"}); 
  estruturaDoOrcamento.belongsTo(projeto, {foreignKey: "projeto", as: "ALIASprojetoALIASestruturaDoOrcamento"}); 

  empreendimento.hasOne(funcaoDePrevisao, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIASfuncaoDePrevisao"}); 
  funcaoDePrevisao.belongsTo(empreendimento, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIASfuncaoDePrevisao"}); 

  empreendimento.hasOne(indicador, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIASindicador"}); 
  indicador.belongsTo(empreendimento, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIASindicador"}); 

  empreendimento.hasOne(registroDeIndicador, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIASregistroDeIndicador"}); 
  registroDeIndicador.belongsTo(empreendimento, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIASregistroDeIndicador"}); 

  indicador.hasOne(registroDeIndicador, {foreignKey: "indicador", as: "ALIASindicadorALIASregistroDeIndicador"}); 
  registroDeIndicador.belongsTo(indicador, {foreignKey: "indicador", as: "ALIASindicadorALIASregistroDeIndicador"}); 

  lancamentoContabil.hasOne(partidaDoLancamento, {foreignKey: "lancamentoContabil", as: "ALIASlancamentoContabilALIASpartidaDoLancamento"}); 
  partidaDoLancamento.belongsTo(lancamentoContabil, {foreignKey: "lancamentoContabil", as: "ALIASlancamentoContabilALIASpartidaDoLancamento"}); 

  historicoPadrao.hasOne(partidaDoLancamento, {foreignKey: "historicoPadrao", as: "ALIAShistoricoPadraoALIASpartidaDoLancamento"}); 
  partidaDoLancamento.belongsTo(historicoPadrao, {foreignKey: "historicoPadrao", as: "ALIAShistoricoPadraoALIASpartidaDoLancamento"}); 

  centroDeCusto.hasOne(partidaDoLancamento, {foreignKey: "centroDeCusto", as: "ALIAScentroDeCustoALIASpartidaDoLancamento"}); 
  partidaDoLancamento.belongsTo(centroDeCusto, {foreignKey: "centroDeCusto", as: "ALIAScentroDeCustoALIASpartidaDoLancamento"}); 

  projeto.hasOne(partidaDoLancamento, {foreignKey: "projeto", as: "ALIASprojetoALIASpartidaDoLancamento"}); 
  partidaDoLancamento.belongsTo(projeto, {foreignKey: "projeto", as: "ALIASprojetoALIASpartidaDoLancamento"}); 

  planoDeContas.hasOne(partidaDoLancamento, {foreignKey: "contaDebito", as: "ALIAScontaDebitoALIASpartidaDoLancamento"}); 
  partidaDoLancamento.belongsTo(planoDeContas, {foreignKey: "contaDebito", as: "ALIAScontaDebitoALIASpartidaDoLancamento"}); 

  planoDeContas.hasOne(partidaDoLancamento, {foreignKey: "contaCredito", as: "ALIAScontaCreditoALIASpartidaDoLancamento"}); 
  partidaDoLancamento.belongsTo(planoDeContas, {foreignKey: "contaCredito", as: "ALIAScontaCreditoALIASpartidaDoLancamento"}); 

  tabelaMoeda.hasOne(partidaDoLancamento, {foreignKey: "moedaIndexada", as: "ALIASmoedaIndexadaALIASpartidaDoLancamento"}); 
  partidaDoLancamento.belongsTo(tabelaMoeda, {foreignKey: "moedaIndexada", as: "ALIASmoedaIndexadaALIASpartidaDoLancamento"}); 

  estabelecimento.hasOne(usuarioDoEstabelecimento, {foreignKey: "estabelecimento", as: "ALIASestabelecimentoALIASusuarioDoEstabelecimento"}); 
  usuarioDoEstabelecimento.belongsTo(estabelecimento, {foreignKey: "estabelecimento", as: "ALIASestabelecimentoALIASusuarioDoEstabelecimento"}); 

  empreendimento.hasOne(cotacaoMoeda, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIAScotacaoMoeda"}); 
  cotacaoMoeda.belongsTo(empreendimento, {foreignKey: "empreendimento", as: "ALIASempreendimentoALIAScotacaoMoeda"}); 

  tabelaMoeda.hasOne(cotacaoMoeda, {foreignKey: "moeda", as: "ALIASmoedaALIAScotacaoMoeda"}); 
  cotacaoMoeda.belongsTo(tabelaMoeda, {foreignKey: "moeda", as: "ALIASmoedaALIAScotacaoMoeda"}); 

  estabelecimento.hasOne(lancamentoContabil, {foreignKey: "estabelecimento", as: "ALIASestabelecimentoALIASlancamentoContabil"}); 
  lancamentoContabil.belongsTo(estabelecimento, {foreignKey: "estabelecimento", as: "ALIASestabelecimentoALIASlancamentoContabil"}); 

  estruturaDoOrcamento.hasOne(lancamentoContabil, {foreignKey: "EstruturaDoOrcamento", as: "ALIASEstruturaDoOrcamentoALIASlancamentoContabil"}); 
  lancamentoContabil.belongsTo(estruturaDoOrcamento, {foreignKey: "EstruturaDoOrcamento", as: "ALIASEstruturaDoOrcamentoALIASlancamentoContabil"}); 

  lancamentoContabil.hasMany(partidaDoLancamento, {foreignKey: "LancamentoContabil", as: "ALIASPartidasdoLancamentoALIASlancamentoContabilALIAS"}); 

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
  //Models de controle de acesso a ambiente 
  models.set('ComponentStructure', componentStructure); 
  models.set('ComponentStructureRole', componentStructureRole); 
  models.set('VerificationEmail', verificationEmail); 
  //Models de arquivos 
  models.set('File', file); 
  models.set('FieldFile', fieldFile); 
  //Models de menu 
  models.set('Menu', menu); 
  models.set('MenuItem', menuItem); 
  models.set('MenuConfig', menuConfig); 
  models.set('RoleMenu', roleMenu); 
  //Modelos do projeto
  models.set('Empreendimento', empreendimento); 
  models.set('Estabelecimento', estabelecimento); 
  models.set('AreaDeNegocio', areaDeNegocio); 
  models.set('PlanoDeContas', planoDeContas); 
  models.set('CentroDeCusto', centroDeCusto); 
  models.set('Projeto', projeto); 
  models.set('HistoricoPadrao', historicoPadrao); 
  models.set('PlanilhaDoOrcamento', planilhaDoOrcamento); 
  models.set('EstruturaDoOrcamento', estruturaDoOrcamento); 
  models.set('FuncaoDePrevisao', funcaoDePrevisao); 
  models.set('Indicador', indicador); 
  models.set('RegistroDeIndicador', registroDeIndicador); 
  models.set('PartidaDoLancamento', partidaDoLancamento); 
  models.set('UsuarioDoEstabelecimento', usuarioDoEstabelecimento); 
  models.set('TabelaMoeda', tabelaMoeda); 
  models.set('CotacaoMoeda', cotacaoMoeda); 
  models.set('LancamentoContabil', lancamentoContabil); 

  return models; 
} 
