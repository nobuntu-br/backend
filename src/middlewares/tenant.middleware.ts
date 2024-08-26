import { Request, Response, NextFunction } from "express";
import { getTenantConnection } from "../adapters/database.config";
import TenantConnection from "../models/tenantConnection.model";
import { getSecurityTenantConnection } from "../adapters/databaseSecurity.config";
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
export default async function changeTenant(req: Request, res: Response, next: NextFunction) {

  const tenantId = req.header('X-Tenant-ID');

  if (tenantId == undefined) {
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
    const databaseConnection = await getTenantConnection(tenantId, decoded.oid);

    if (databaseConnection == null) {
      return res.status(404).json({ message: 'Tenant não encontrado' });
    }

    req.databaseConnection = databaseConnection;

    next();
  } catch (error) {
    console.warn(error);
    return res.status(500).json({ message: "Erro ao obter o tenant", details: error || "Identificador de tenant a ser usado na operação não é válido" });
  }
};

export async function getSecurityTenant(req: Request, res: Response, next: NextFunction) {
  try {
    //TODO fazer uma verificação de permissão

    req.databaseConnection = await getSecurityTenantConnection();

    next();
  } catch (error) {
    return res.status(500).json({ message: "Erro ao obter o tenant", details: error || "Identificador de tenant a ser usado na operação não é válido" });
  }
}