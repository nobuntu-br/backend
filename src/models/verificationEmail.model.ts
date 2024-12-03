import { BaseResourceModel } from "./baseResource.model";

export interface IVerificationEmail extends BaseResourceModel{
  email?: string;
  verificationCode?: string;
  isVerified?: boolean;
  verifiedDate?: Date;
  expirationDate?: Date;
  createdAt?: Date;
}

export class VerificationEmail extends BaseResourceModel implements IVerificationEmail {
  email?: string;
  verificationCode?: string;
  isVerified?: boolean;
  verifiedDate?: Date;
  expirationDate?: Date;
  createdAt?: Date;

  static fromJson(jsonData: any) : VerificationEmail {
    return Object.assign(new VerificationEmail(), jsonData);
  }
}