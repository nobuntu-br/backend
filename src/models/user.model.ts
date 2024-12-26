import { BaseResourceModel } from "./baseResource.model";

export interface IUserDatabaseModel extends BaseResourceModel {
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

export interface IUser extends BaseResourceModel {
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
  UID?: string; //Isso é da Azure
  tenantUID?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
  memberType?: string;
  email?: string;

  constructor(data: IUser) {
    super();
    this.id = data.id;
    this.password = data.password;
    this.UID = data.UID;
    this.tenantUID = data.tenantUID;
    this.userName = data.userName;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.isAdministrator = data.isAdministrator;
    this.memberType = data.memberType;
    this.email = data.email;
  }

  static fromJson(jsonData: any): User {
    return new User(jsonData);
  }

  getFullName(){
    return this.firstName+' '+this.lastName; 
  }
}