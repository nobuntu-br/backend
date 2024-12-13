import { IUser } from "../models/user.model";
import { SignInOutputDTO } from "../models/DTO/signin.DTO";

export interface IidentityService {
  getAccessToken(): Promise<string>;
  refreshAccessToken(refreshToken: string): Promise<string>;
  getUserByEmail(email: string): Promise<IUser>;
  createUser(user: IUser): Promise<IUser>;
  loginUser(username: string, password: string): Promise<SignInOutputDTO>;
  updateUser(user: IUser): Promise<IUser>;
  changeUserPassword(userUID: string, newPassword: string): Promise<string>;
  deleteUser(userID: string): Promise<string>;
  getUserImage(userID: string): any;
}