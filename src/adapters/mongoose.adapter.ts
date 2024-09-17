import { Model } from "mongoose";
import { IDatabaseAdapter } from "./IDatabase.adapter";

export class MongooseAdapter<T> implements IDatabaseAdapter<T> {

  private model: Model<any>;

  constructor(model: Model<any>, protected jsonDataToResourceFn: (jsonData: any) => T) {
    this.model = model;
  }
  

  async create(data: any): Promise<T> {
    try {
      
      const item = new this.model(data);
      const newItem = await item.save();
      return this.jsonDataToResource(newItem);
    } catch (error) {
      console.warn("Error to save entity to database using mongoose. Details: "+error);
      throw new Error("Error to save entity to database using mongoose.")
    }

  }

  async findAll(limitPerPage: number, offset: number): Promise<T[]> {
    try {
      const returnedValues = await this.model.find({}).skip(offset).limit(limitPerPage);

      return this.jsonDataToResources(returnedValues);
    } catch (error) {
      console.warn("Error to save entity to database using mongoose. Details: "+error);
      throw new Error("Error to save entity to database using mongoose.")
    }
    
  }

  async findOne(query: any): Promise<T | null> {

    try {
      //TODO testar e adicionar o populate
      const returnedValue = await this.model.findOne( query );

      if (returnedValue == null) {
        return null;
      }

      return this.jsonDataToResource(returnedValue);
    } catch (error) {
      console.warn("Error to find one entity to database using mongoose. Details: "+error);
      throw new Error("Error to find one entity to database using mongoose.")
    }
  }

  findMany(query: any): Promise<T[] | null> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<T | null> {
    try {
      const returnedValue = await this.model.findById(id).exec();

      if(returnedValue == null){
        return null;
      }

      return this.jsonDataToResource(returnedValue);
    } catch (error) {
      console.warn("Error to get by id entity to database using mongoose. Details: " + error);
      throw new Error("Error to get by id entity to database using mongoose.");
    }
  }

  async getCount(): Promise<number | null> {
    try {
      var count = await this.model.countDocuments();
      return count;
    } catch (error) {
      console.warn("Error to get count entities to database using mongoose. Details: " + error);
      throw new Error("Error to get count entities to database using mongoose.");
    }
  }

  async update(id: string, data: Object): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { useFindAndModify: false });
  }

  async delete(id: string): Promise<T | null> {
    
    try {
      const removedItem = await this.model.findByIdAndDelete(id);
      return this.jsonDataToResource(removedItem);
    } catch (error) {
      console.warn("Error to get delete entity to database using mongoose. Details: " + error);
      throw new Error("Error to get delete entity database using mongoose.");
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await this.model.deleteMany({});
    } catch (error) {
      console.warn("Error to get delete all entity to database using mongoose. Details: " + error);
      throw new Error("Error to get delete all entity database using mongoose.");
    }
  }

  async findCustom(query: any): Promise<T[] | null> {
    return await this.model.aggregate(query);
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
