import { BaseResourceModel } from "./base-resource.model";

interface IUser {
  name?: string;
  UID?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
  memberType?: string;
}

export class User extends BaseResourceModel implements IUser {
  name?: string;
  UID?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
  memberType?: string;

  static fromJson(jsonData: any) : User {
    return Object.assign(new User(), jsonData);
  }
}
