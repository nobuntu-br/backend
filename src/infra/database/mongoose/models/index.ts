import { Connection, Mongoose } from "mongoose";  
import userModel from "./user.model";
import roleModel from "./role.model";
import functionSystemModel from "./functionSystem.model";
import functionSystemRoleModel from "./functionSystemRole.model";
import userRoleModel from "./userRole.model";
import componentStructureModel from "./componentStructure.model";
import componentStructureRoleModel from "./componentStructureRole.model";
import verificationEmailModel from "./verificationEmail.model";
import TenantConnection from "../../../../domain/entities/tenantConnection.model";
import counterModel from "./counter.model";

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
  const mongooseConnection = tenantConnection.connection; 
  if(mongooseConnection instanceof Connection == false){ 
    throw new Error("Instance of database connection is incompatible with setModels function on mongoose."); 
  } 

  const user = userModel(mongooseConnection); 
  const role = roleModel(mongooseConnection); 
  const userRole = userRoleModel(mongooseConnection); 
  const functionSystem = functionSystemModel(mongooseConnection); 
  const functionSystemRole = functionSystemRoleModel(mongooseConnection); 
  const componentStructure = componentStructureModel(mongooseConnection); 
  const componentStructureRole = componentStructureRoleModel(mongooseConnection); 
  const verificationEmail = verificationEmailModel(mongooseConnection); 
  const counter = counterModel(mongooseConnection); 


  const empreendimento = empreendimentoModel(mongooseConnection); 

  const estabelecimento = estabelecimentoModel(mongooseConnection); 

  const areaDeNegocio = areaDeNegocioModel(mongooseConnection); 

  const planoDeContas = planoDeContasModel(mongooseConnection); 

  const centroDeCusto = centroDeCustoModel(mongooseConnection); 

  const projeto = projetoModel(mongooseConnection); 

  const historicoPadrao = historicoPadraoModel(mongooseConnection); 

  const planilhaDoOrcamento = planilhaDoOrcamentoModel(mongooseConnection); 

  const estruturaDoOrcamento = estruturaDoOrcamentoModel(mongooseConnection); 

  const funcaoDePrevisao = funcaoDePrevisaoModel(mongooseConnection); 

  const indicador = indicadorModel(mongooseConnection); 

  const registroDeIndicador = registroDeIndicadorModel(mongooseConnection); 

  const partidaDoLancamento = partidaDoLancamentoModel(mongooseConnection); 

  const usuarioDoEstabelecimento = usuarioDoEstabelecimentoModel(mongooseConnection); 

  const tabelaMoeda = tabelaMoedaModel(mongooseConnection); 

  const cotacaoMoeda = cotacaoMoedaModel(mongooseConnection); 

  const lancamentoContabil = lancamentoContabilModel(mongooseConnection); 

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
  models.set('Counter', counter); 
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
