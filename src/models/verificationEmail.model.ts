import { BaseResourceModel } from "./base-resource.model";

export interface IVerificationEmail {
  id?: string;
  email?: string;
  verificationCode?: string;
  createdAt?: Date;
}

export class VerificationEmail extends BaseResourceModel implements IVerificationEmail {
  id?: string;
  email?: string;
  verificationCode?: string;
  createdAt?: Date;

  static fromJson(jsonData: any) : VerificationEmail {
    return Object.assign(new VerificationEmail(), jsonData);
  }
}