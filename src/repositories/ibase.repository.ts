import { Model } from "mongoose";
import { FilterValue } from "../utils/mongoose/customQuery.util";
import { ModelStatic } from "sequelize";

export interface IBaseRepository<T> {
  create(data: T): Promise<T>;
  findAll(limitPerPage: number, offset: number): Promise<T[]>;
  findOne(query: T): Promise<T>;
  findMany(query: T): Promise<T[]>;
  findById(id: string): Promise<T>;
  getCount(): Promise<number>;
  update(id: string, data: Object): Promise<T>;
  delete(id: string): Promise<T>;
  deleteAll(): Promise<void>;
  findCustom(filterValues: FilterValue[], filterConditions: string[], model: Model<any> | ModelStatic<any>): Promise<T[] | null>;
  findUsingCustomQuery(query: any): Promise<T[]>;
}
