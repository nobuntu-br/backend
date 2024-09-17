import { BaseResourceModel } from "./base-resource.model";

export interface ITenantCredential {
  dbName?: string;
  dbType?: string;
  dbUsername?: string;
  dbPassword?: string;
  dbHost?: string;
  dbPort?: string;
  dbConfig?: string;
}

export class TenantCredential extends BaseResourceModel implements ITenantCredential {
  dbName?: string;
  dbType?: string;
  dbUsername?: string;
  dbPassword?: string;
  dbHost?: string;
  dbPort?: string;
  dbConfig?: string;

  static fromJson(jsonData: any) : TenantCredential {
    return Object.assign(new TenantCredential(), jsonData);
  }
}

// Função para verificar se todos os campos necessários estão preenchidos
export function validateTenantCredential(credential: ITenantCredential): boolean {
  // Verifica se todos os campos necessários são definidos e não são vazios
  return (
    credential.dbType !== undefined &&
    credential.dbName !== undefined &&
    credential.dbUsername !== undefined &&
    credential.dbPassword !== undefined &&
    credential.dbHost !== undefined &&
    credential.dbType !== "" &&
    credential.dbName !== "" &&
    credential.dbUsername !== "" &&
    credential.dbPassword !== "" &&
    credential.dbHost !== ""
  );
}