import { IUser } from "../user.model";
import { IUserAccessData } from "../userAcessData.model";

export interface SignInDTO {
  email: string;
  password: string;
}

export interface SignInOutputDTO {
  user: IUser
  tokens: IUserAccessData
}
