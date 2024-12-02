import { BaseResourceModel } from "./baseResource.model";

export interface IUser {
  id?: string;
  UID?: string;
  tenantUID?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
  memberType?: string;
  email?: string;
  password?: string;

}

export class User extends BaseResourceModel implements IUser {
  password?: string | undefined;
  UID?: string;
  tenantUID?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
  memberType?: string;
  email?: string;

  static fromJson(jsonData: any) : User {
    return Object.assign(new User(), jsonData);
  }

  // getFullName(){
  //   return this.firstName+' '+this.lastName; 
  // }
}