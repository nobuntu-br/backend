import { BaseResourceModel } from "./baseResource.model";

export interface IVerificationEmailDatabaseModel extends BaseResourceModel {
  email?: string;
  verificationCode?: string;
  isVerified?: boolean;
  verifiedDate?: Date;
  expirationDate?: Date;
  createdAt?: Date;
}

export interface IVerificationEmail extends BaseResourceModel {
  email: string;
  verificationCode: string;
  isVerified: boolean;
  verifiedDate?: Date;
  expirationDate?: Date;
  createdAt?: Date;
}

export class VerificationEmail extends BaseResourceModel implements IVerificationEmail {
  email: string;
  verificationCode: string;
  isVerified: boolean;
  verifiedDate?: Date;
  expirationDate?: Date;
  createdAt?: Date;

  constructor(data: IVerificationEmail) {
    super();
    this.id = data.id;
    this.email = data.email;
    this.verificationCode = data.verificationCode;
    this.isVerified = data.isVerified;
    this.verifiedDate = data.verifiedDate;
    this.expirationDate = data.expirationDate;
    this.createdAt = data.createdAt;
  }

  static fromJson(jsonData: any): VerificationEmail {
    return new VerificationEmail(jsonData);
  }

  isEmailExpired(): boolean {
    const currentDate = new Date();

    if (this.expirationDate == undefined) {
      return false;
    }

    if (currentDate > this.expirationDate) {
      return true;
    }

    return false;
  }
}