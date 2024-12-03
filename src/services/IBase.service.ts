import { Model } from "mongoose";
import { FilterValue } from "../utils/mongoose/customQuery.util";

export interface IBaseService<TInterface, TClass> {
  create(data: TClass): Promise<TClass>;
  findAll(limitPerPage: number, offset: number): Promise<TClass[] | null>;
  findOne(query: TInterface): Promise<TClass | null>;
  findMany(query: TInterface): Promise<TClass[] | null>;
  findById(id: number): Promise<TClass | null>;
  getCount(): Promise<number | null>;
  update(id: number, data: Object): Promise<TClass | null>;
  delete(id: number): Promise<TClass | null>;
  deleteAll(): Promise<void>;
  findCustom(filterValues: FilterValue[], filterConditions: string[], model: Model<any> | typeof Model): Promise<TClass[] | null>;
}
