import { Model } from "mongoose";
import { IDatabaseAdapter } from "./IDatabase.adapter";
import findDataByCustomQuery from "../utils/mongoose/customQuery.util";
import { NotFoundError } from "../errors/notFound.error";
import { UnknownError } from "../errors/unknown.error";

/**
 * Implementação das funcionalidades do banco de dados com uso da biblioteca Mongoose
 */
export class MongooseAdapter<T> implements IDatabaseAdapter<T> {

  private _model: Model<any>;
  private _databaseType: string;

  constructor(model: Model<any>, databaseType: string, protected jsonDataToResourceFn: (jsonData: any) => T) {
    this._model = model;
    this._databaseType = databaseType;
  }

  get databaseType(){
    return this._databaseType;
  }

  get model(){
    return this._model;
  }

  async create(data: any): Promise<T> {
    try {
      const item = new this._model(data);
      const newItem = await item.save();
      return this.jsonDataToResource(newItem);
    } catch (error) {
      throw new UnknownError("Error to save document using mongoose. Detail: "+ error);
    }

  }

  async findAll(limitPerPage: number, offset: number): Promise<T[]> {
    try {
      const returnedValues = await this._model.find({}).skip(offset).limit(limitPerPage);

      return this.jsonDataToResources(returnedValues);
    } catch (error) {
      throw new UnknownError("Error to save document using mongoose. Detail: "+ error);
    }
    
  }

  async findOne(query: any): Promise<T> {

    try {
      const returnedValue = await this._model.findOne( query );

      if (returnedValue == null) {
        throw new NotFoundError("Not found document");
      }

      return this.jsonDataToResource(returnedValue);
    } catch (error) {

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError("Error to find one document using mongoose. Detail: "+ error);
    }
  }

  findMany(query: any): Promise<T[]> {
    throw new Error("Method not implemented");
  }

  async findById(id: string): Promise<T> {
    try {
      const returnedValue = await this._model.findById(id).exec();

      if(returnedValue == null){
        throw new NotFoundError("Not found document");
      }

      return this.jsonDataToResource(returnedValue);
    } catch (error) {

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError("Error to find document by id using mongoose. Detail: "+ error);
    }
  }

  async getCount(): Promise<number> {
    try {
      return await this._model.countDocuments();
    } catch (error) {
      throw new UnknownError("Error to get document count using mongoose. Detail: "+ error);
    }
  }

  async update(id: string, data: Object): Promise<T> {
    try {
      const returnedValue = await this._model.findByIdAndUpdate(id, data, { useFindAndModify: false, new: true });

      if(returnedValue == null){
        throw new NotFoundError("Not found document");
      }

      return this.jsonDataToResource(returnedValue);
    } catch (error) {

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError("Error to update document using Mongoose. Detail: "+ error);
    }
  }

  async delete(id: string): Promise<T> {
    
    try {
      const returnedValue = await this._model.findByIdAndDelete(id);

      if(returnedValue == null){
        throw new NotFoundError("Not found document");
      }

      return this.jsonDataToResource(returnedValue);
    } catch (error) {

      if (error instanceof NotFoundError) {
        throw error;
      }
      
      throw new UnknownError("Error to delete document using mongoose. Detail: "+ error);
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await this._model.deleteMany({});
    } catch (error) {
      throw new UnknownError("Error to delete all documents using mongoose. Detail: "+ error);
    }
  }

  async findCustom(filterValues: any[], filterConditions: string[], model: Model<any>): Promise<T[] | null> {
    try{
      const items = await findDataByCustomQuery(filterValues, filterConditions, model);

      return this.jsonDataToResources(items);
    } catch (error) {
      throw new UnknownError("Error to find custom entity using Sequelize. Detail: "+ error);
    }
  }

  async findUsingCustomQuery(query: any): Promise<T[]> {
    try {
      return await this._model.aggregate(query);
    } catch (error) {
      throw new UnknownError("Error to execute custom query to find document using Sequelize. Detail: "+ error);
    }
  }

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(
      element => resources.push(this.jsonDataToResourceFn(element.toObject()))
    );
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData.toObject());
  }

}