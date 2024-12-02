import { DatabaseType } from "../adapters/createDb.adapter";
import FileRepository from "../repositories/file.repository";
import { File } from "../models/file.model"; 
import BaseService from "./base.service";

export class FileService extends BaseService<File>{

  constructor(databaseType: DatabaseType, databaseConnection: any) { 
    //Cria o repositório com dados para obter o banco de dados 
    var repository : FileRepository = new FileRepository(databaseType, databaseConnection); 
    super(repository, databaseType, databaseConnection); 
  } 

}
