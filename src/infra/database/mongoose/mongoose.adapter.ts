import { ClientSession, Connection, Model, Mongoose } from "mongoose";
import { NotFoundError } from "../../../errors/notFound.error";
import { UnknownError } from "../../../errors/unknown.error";
import findDataByCustomQuery from "../../../utils/mongoose/customQuery.util";
import { IDatabaseAdapter } from "../IDatabase.adapter";

/**
 * Implementação das funcionalidades do banco de dados com uso da biblioteca Mongoose
 */
export class MongooseAdapter<TInterface, TClass> implements IDatabaseAdapter<TInterface, TClass> {

  private _model: Model<any>;
  private _databaseType: string;
  private _databaseConnection: Connection;

  constructor(model: Model<any>, databaseType: string, databaseConnection: Connection, protected jsonDataToResourceFn: (jsonData: any) => TClass) {
    this._model = model;
    this._databaseType = databaseType;
    this._databaseConnection = databaseConnection;
  }

  get databaseType(){
    return this._databaseType;
  }

  get model(){
    return this._model;
  }

  get databaseConnection(): Connection {
    return this._databaseConnection;
  }

  async create(data: TInterface): Promise<TClass> {
    try {
      const item = new this._model(data);
      const newItem = await item.save();
      return this.jsonDataToResource(newItem);
    } catch (error) {
      throw new UnknownError("Error to save document using mongoose. Detail: "+ error);
    }

  }

  async findAll(limitPerPage: number, offset: number): Promise<TClass[]> {
    try {
      const returnedValues = await this._model.find({}).skip(offset).limit(limitPerPage);

      return this.jsonDataToResources(returnedValues);
    } catch (error) {
      throw new UnknownError("Error to save document using mongoose. Detail: "+ error);
    }
    
  }

  async findOne(query: TInterface): Promise<TClass | null> {

    //TODO verificar na query se tem um "id" para tornar um "_id";

    try {
      const returnedValue = await this.model.findOne( query! );

      if (returnedValue == null) {
        return null;
      }

      return this.jsonDataToResource(returnedValue);
    } catch (error) {

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError("Error to find one document using mongoose. Detail: "+ error);
    }
  }

  async findMany(query: TInterface): Promise<TInterface[]> {

    //TODO verificar na query se tem um "id" para tornar um "_id";

    try {
      const returnedValue = await this.model.find( query! );

      if (returnedValue == null) {
        return [];
      }

      return returnedValue;
    } catch (error) {

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError("Error to find many documents using mongoose. Detail: "+ error);
    }
  }

  async findById(id: number): Promise<TClass | null> {
    try {
      const returnedValue = await this._model.findById(id).exec();

      if(returnedValue == null){
        return null;
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

  async update(id: number, data: Object): Promise<TClass | null> {
    try {
      const returnedValue = await this._model.findByIdAndUpdate(id, data, { useFindAndModify: false, new: true });

      if(returnedValue == null){
        return null;
      }

      return this.jsonDataToResource(returnedValue);
    } catch (error) {

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError("Error to update document using Mongoose. Detail: "+ error);
    }
  }

  async delete(id: number): Promise<TClass | null> {
    
    try {
      const returnedValue = await this._model.findByIdAndDelete(id);

      if(returnedValue == null){
        return null;
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

  async executeQuery(query: string): Promise<Object>{
    throw new Error("Method not implemented");
  }

  async findCustom(filterValues: any[], filterConditions: string[], model: Model<any>): Promise<TClass[] | null> {
    try{
      const items = await findDataByCustomQuery(filterValues, filterConditions, model);

      return this.jsonDataToResources(items);
    } catch (error) {
      throw new UnknownError("Error to find custom entity using Sequelize. Detail: "+ error);
    }
  }

  async findUsingCustomQuery(query: any): Promise<TClass[]> {
    try {
      return await this._model.aggregate(query);
    } catch (error) {
      throw new UnknownError("Error to execute custom query to find document using Sequelize. Detail: "+ error);
    }
  }

  protected jsonDataToResources(jsonData: any[]): TClass[] {
    const resources: TClass[] = [];
    jsonData.forEach(
      element => resources.push(this.jsonDataToResourceFn(element.toObject()))
    );
    return resources;
  }

  protected jsonDataToResource(jsonData: any): TClass {
    return this.jsonDataToResourceFn(jsonData.toObject());
  }

  async startTransaction(): Promise<ClientSession>{
    try {
      let transaction = await this.databaseConnection.startSession();
      transaction.startTransaction();
      return transaction; 
    } catch (error) {
      throw new UnknownError("Error to start transaction using Mongoose. Detail: "+ error);
    }
  }

  async commitTransaction(transaction: ClientSession): Promise<void>{
    try {
      await transaction.commitTransaction();
      await transaction.endSession();
    } catch (error) {
      throw new UnknownError("Error to commit transaction using Mongoose. Detail: "+ error);
    }
  }

  async rollbackTransaction(transaction: ClientSession): Promise<void>{
    try {
      await transaction.abortTransaction();
      await transaction.endSession();
    } catch (error) {
      throw new UnknownError("Error to commit transaction using Mongoose. Detail: "+ error);
    }
  }

  async createWithTransaction(data: TInterface, transaction: ClientSession): Promise<TClass>{
    try {
      const returnedValue = await this.model.create([data], {session: transaction});
      return this.jsonDataToResource(returnedValue[0]);
    } catch (error) {
      this.rollbackTransaction(transaction);
      throw new UnknownError("Error to save document with transaction using Mongoose. Detail: "+ error);
    }
  }

  async updateWithTransaction(id: number, data: Object, transaction: ClientSession): Promise<TClass>{
    try {
      const returnedValue = await this._model.findByIdAndUpdate(id, data, { useFindAndModify: false, new: true, session: transaction });

      if(returnedValue == null){
        throw new NotFoundError("Not found document");
      }

      return this.jsonDataToResource(returnedValue);
    } catch (error) {
      this.rollbackTransaction(transaction);
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError("Error to update document with transaction using Mongoose. Detail: "+ error);
    }
  }

  async deleteWithTransaction(id: number, transaction: ClientSession): Promise<TClass>{
    try {
      const returnedValue = await this._model.findByIdAndDelete(id, {session: transaction});

      if(returnedValue == null){
        throw new NotFoundError("Not found document");
      }

      return this.jsonDataToResource(returnedValue);
    } catch (error) {
      this.rollbackTransaction(transaction);
      if (error instanceof NotFoundError) {
        throw error;
      }
      
      throw new UnknownError("Error to delete document with transaction using Mongoose. Detail: "+ error);
    }
  }

  //TODO procurar a função de varredura das classes que são relacionadas para preencher o populate
  async findAllWithAagerLoading(limitPerPage: number, offset: number): Promise<TClass[]>{
    throw new Error("Method not implemented");
  }

  async findOneWithEagerLoading(query: TInterface): Promise<TClass | null>{
    throw new Error("Method not implemented");
  }

  findManyWithEagerLoading(query: TInterface): Promise<TClass[]>{
    throw new Error("Method not implemented");
  }

  async findByIdWithEagerLoading(id: number): Promise<TClass | null>{
    throw new Error("Method not implemented");
  }

}