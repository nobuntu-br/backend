import { IUser } from "../models/user.model";
import { SignInOutputDTO } from "../useCases/authentication/signIn.useCase";

export interface IidentityService {
  getAccessToken(): Promise<string>;
  getUserGroups(userId: string): Promise<any>;
  refreshAccessToken(refreshToken: string): Promise<string>;
  getUserByEmail(email: string): Promise<IUser>;
  createUser(user: IUser): Promise<IUser>;
  loginUser(username: string, password: string): Promise<SignInOutputDTO>;
  updateUser(user: IUser): Promise<IUser>;
  resetUserPassword(userUID: string, newPassword: string): Promise<string>;
  deleteUser(userID: string): Promise<string>;
  getUserProfilePhoto(userID: string): any;
  updateUserProfilePhoto(accessToken: string, photoBlob: Blob): Promise<boolean>;
}