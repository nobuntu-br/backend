import { BaseResourceModel } from "./baseResource.model";
import { User } from "./user.model";

export interface IUserPasswordResetTokenDatabaseModel extends BaseResourceModel {
  userId?: number;
  token?: string;
  used?: boolean;
  usedAt?: Date;
  expiresAt?: Date;
  createdAt?: Date;
}

export interface IUserPasswordResetToken extends BaseResourceModel {
  user: User | number;
  token: string;
  used: boolean;
  usedAt?: Date;
  expiresAt?: Date;
  createdAt?: Date;
}

/**
 * Classe responsável por armazenar informações da requisição para mudança de senha nas contas dos usuários
 */
export class UserPasswordResetToken extends BaseResourceModel implements IUserPasswordResetToken {
  user: User | number;
  token: string;
  used: boolean;
  usedAt?: Date;
  expiresAt?: Date;
  createdAt?: Date;

  constructor(data: IUserPasswordResetToken) {
    super();
    this.id = data.id;
    this.user = data.user;
    this.token = data.token;
    this.used = data.used;
    this.usedAt = data.usedAt;
    this.expiresAt = data.expiresAt;
    this.createdAt = data.createdAt;
  }

  static fromJson(jsonData: any): UserPasswordResetToken {
    return new UserPasswordResetToken(jsonData);
  }

  isExpired(): boolean {
    const currentDate = new Date();

    if (this.expiresAt == undefined) {
      return false;
    }

    if (currentDate > this.expiresAt) {
      return true;
    }

    return false;
  }
}