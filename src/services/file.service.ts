import { DbType } from "../adapters/createDb.adapter";
import FileRepository from "../repository/file.repository";
import { File } from "../models/file.model"; 
import BaseService from "./base.service";

export class FileService extends BaseService<File>{

  constructor(dbType: DbType, model: any, databaseConnection: any) { 
    //Cria o repositório com dados para obter o banco de dados 
    var repository : FileRepository = new FileRepository(dbType, model, databaseConnection); 
    super(repository, dbType, model, databaseConnection); 
  } 

}
