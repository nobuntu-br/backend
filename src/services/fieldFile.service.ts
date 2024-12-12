import FieldFileRepository from "../repositories/fieldFile.repository";
import { FieldFile, IFieldFile } from "../models/fieldFile.model";
import BaseService from "./base.service";
import TenantConnection from "../models/tenantConnection.model";

export class FieldFileService extends BaseService<IFieldFile, FieldFile> {
  private fieldFileRepository: FieldFileRepository;

  constructor(tenantConnection: TenantConnection) {
    //Cria o repositório com dados para obter o banco de dados
    let repository: FieldFileRepository = new FieldFileRepository(tenantConnection);
    super(repository, tenantConnection);

    this.fieldFileRepository = repository;

  }

  async upload(fieldFile: FieldFile): Promise<string> {
    try {
      const data = await this.fieldFileRepository.upload(fieldFile);
      return data;
    } catch (error) {
      throw error;
    }
  }

}
