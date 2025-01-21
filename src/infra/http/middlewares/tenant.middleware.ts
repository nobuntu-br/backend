import { Request, Response, NextFunction } from "express";
import { getTenantConnection } from "../../database/database.config";
import { GetSecurityTenantConnectionUseCase } from "../../../useCases/tenant/getSecurityTenantConnection.useCase";
import TenantConnection from "../../../domain/entities/tenantConnection.model";
var jwt = require('jsonwebtoken');

declare global {
  namespace Express {
    interface Request {
      databaseConnection?: TenantConnection;
    }
  }
}

/**
 * Função responsável por retornar por obter dados de qual tenant o usuário está fazendo uso, para tal tenant ser usado em alguma operação da API.
 */
export default async function getUserTenant(req: Request, res: Response, next: NextFunction) {

  const databaseCredentialId : number = Number(req.header('X-Tenant-ID'));

  if (isNaN(databaseCredentialId)) {
    return res.status(401).send({ message: "Token do tenant não fornecido ou inválido" });
  }

  const userAuthorizationCode = req.header('Authorization');

  if (userAuthorizationCode == undefined || !userAuthorizationCode.startsWith('Bearer ')) {
    return res.status(401).send({ message: "Token de acesso não fornecido ou inválido" });
  }

  const access_token = userAuthorizationCode.split(' ')[1]; // Obtém o token após "Bearer"
  const decoded = jwt.decode(access_token);

  try {
    //Obtem a instância da conexão com banco de dados do usuário
    const tenantConnection : TenantConnection | null = await getTenantConnection(databaseCredentialId, decoded.sub);

    if (tenantConnection == null) {
      return res.status(404).json({ message: 'Tenant não encontrado' });
    }

    req.body.tenantConnection = tenantConnection;

    next();
  } catch (error) {
    console.warn(error);
    return res.status(500).json({ message: "Erro ao obter o tenant", details: error || "Identificador de tenant a ser usado na operação não é válido" });
  }
};

export async function getSecurityTenant(req: Request, res: Response, next: NextFunction) {
  try {
    //TODO fazer uma verificação de permissão

    const getSecurityTenantConnectionUseCase: GetSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();

    req.body.tenantConnection = await getSecurityTenantConnectionUseCase.execute();

    next();
  } catch (error) {
    return res.status(500).json({ message: "Erro ao obter o tenant", details: error || "Identificador de tenant a ser usado na operação não é válido" });
  }
}