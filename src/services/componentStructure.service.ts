import { DatabaseType } from "../adapters/createDb.adapter";
import { ComponentStructure, IComponentStructure } from "../models/componentStructure.model";
import ComponentStructureRepository from "../repositories/componentStructure.repository";
import BaseService from "./base.service";

export class ComponentStructureService extends BaseService<IComponentStructure, ComponentStructure> {
  private componentStructureRepository: ComponentStructureRepository;

  constructor(databaseType: DatabaseType, databaseConnection: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository: ComponentStructureRepository = new ComponentStructureRepository(databaseType, databaseConnection);
    super(repository, databaseType, databaseConnection);

    this.componentStructureRepository = repository;
  }

}