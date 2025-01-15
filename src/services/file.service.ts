import FileRepository from "../repositories/file.repository";
import { File, IFileDatabaseModel } from "../models/file.model";
import BaseService from "./base.service";
import TenantConnection from "../models/tenantConnection.model";

export class FileService extends BaseService<IFileDatabaseModel, File> {
  private fileRepository: FileRepository;

  constructor(tenantConnection: TenantConnection) {
    //Cria o repositório com dados para obter o banco de dados
    let repository: FileRepository = new FileRepository(tenantConnection);
    super(repository, tenantConnection);

    this.fileRepository = repository;

  }
}
