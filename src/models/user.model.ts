import { BaseResourceModel } from "./base-resource.model";

export interface IUser {
  id?: string;
  name?: string;
  UID?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
  memberType?: string;
}

export class User extends BaseResourceModel implements IUser {
  name?: string;
  UID?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
  memberType?: string;

  static fromJson(jsonData: any) : User {
    return Object.assign(new User(), jsonData);
  }
}
