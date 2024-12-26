import { IUser } from "./user.model";

export interface IUserAccessData { 
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresAt?: number;
  user?: IUser;
}