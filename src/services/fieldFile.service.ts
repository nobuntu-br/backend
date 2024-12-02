import { DatabaseType } from "../adapters/createDb.adapter";
import FieldFileRepository from "../repositories/fieldFile.repository";
import { FieldFile } from "../models/fieldFile.model"; 
import BaseService from "./base.service";
import { NextFunction, Request, Response } from "express";

export class FieldFileService extends BaseService<FieldFile>{

  fieldFileRepository: FieldFileRepository;

  constructor(databaseType: DatabaseType, databaseConnection: any) { 
    //Cria o repositório com dados para obter o banco de dados 
    var repository : FieldFileRepository = new FieldFileRepository(databaseType, databaseConnection); 
    super(repository, databaseType, databaseConnection); 
    this.fieldFileRepository = new FieldFileRepository(databaseType, databaseConnection);
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
