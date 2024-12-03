import { Model } from "mongoose";
import { FilterValue } from "../utils/mongoose/customQuery.util";
import { ModelStatic } from "sequelize";

export interface IBaseRepository<TInterface, TClass> {
  create(data: TClass): Promise<TClass>;
  findAll(limitPerPage: number, offset: number): Promise<TClass[]>;
  findOne(query: TInterface): Promise<TClass>;
  findMany(query: TInterface): Promise<TClass[]>;
  findById(id: number): Promise<TClass>;
  getCount(): Promise<number>;
  update(id: number, data: Object): Promise<TClass>;
  delete(id: number): Promise<TClass>;
  deleteAll(): Promise<void>;
  findCustom(filterValues: FilterValue[], filterConditions: string[], model: Model<any> | ModelStatic<any>): Promise<TClass[] | null>;
  findUsingCustomQuery(query: any): Promise<TClass[]>;
}
