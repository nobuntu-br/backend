import { BaseResourceModel } from "./baseResource.model";

export interface IUserDatabaseModel extends BaseResourceModel {
  UID?: string;
  tenantUID?: string;

  userName?: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
  email?: string;
  mobilePhone?: string;
  preferredLanguage?: string;
  password?: string;
}

export interface IUser extends BaseResourceModel {
  UID?: string;
  tenantUID?: string;

  userName?: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
  email?: string;
  mobilePhone: string;
  preferredLanguage: string;
  password?: string;
}

export class User extends BaseResourceModel implements IUser {
  UID?: string; //Isso é da Azure
  tenantUID?: string;

  userName?: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
  email?: string;
  mobilePhone: string;
  preferredLanguage: string;
  password?: string;

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
    this.email = data.email;
    this.mobilePhone = data.mobilePhone;
    this.preferredLanguage = data.preferredLanguage;

  }

  static fromJson(jsonData: any): User {
    return new User(jsonData);
  }

  getFullName(){
    return this.firstName+' '+this.lastName; 
  }
}