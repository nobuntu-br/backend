import { DbType } from "../adapters/createDb.adapter";
import FieldFileRepository from "../repository/fieldFile.repository";
import { FieldFile } from "../models/fieldFile.model"; 
import BaseService from "./base.service";
import { NextFunction, Request, Response } from "express";

export class FieldFileService extends BaseService<FieldFile>{

  fieldFileRepository: FieldFileRepository;

  constructor(dbType: DbType, model: any, databaseConnection: any) { 
    //Cria o repositório com dados para obter o banco de dados 
    var repository : FieldFileRepository = new FieldFileRepository(dbType, model, databaseConnection); 
    super(repository, dbType, model, databaseConnection); 
    this.fieldFileRepository = new FieldFileRepository(dbType, model, databaseConnection);
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
