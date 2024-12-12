import { ComponentStructure, IComponentStructureDatabaseModel } from "../models/componentStructure.model";
import TenantConnection from "../models/tenantConnection.model";
import ComponentStructureRepository from "../repositories/componentStructure.repository";
import BaseService from "./base.service";

export class ComponentStructureService extends BaseService<IComponentStructureDatabaseModel, ComponentStructure> {
  private componentStructureRepository: ComponentStructureRepository;

  constructor(tenantConnection: TenantConnection) {
    //Cria o repositório com dados para obter o banco de dados
    let repository: ComponentStructureRepository = new ComponentStructureRepository(tenantConnection);
    super(repository, tenantConnection);

    this.componentStructureRepository = repository;

  }

}