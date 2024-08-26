import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import { getSecurityTenantConnection } from "../adapters/databaseSecurity.config";
import { FunctionSystemService } from "../services/functionSystem.service";
import TenantConnection from "../models/tenantConnection.model";
import { UserService } from "../services/user.service";
import { FunctionSystemRoleService } from "../services/functionSystemRole.service";
const jwkToPem = require("jwk-to-pem");

async function getJWKS(jwksUri: string): Promise<any[]> {
  try {
    const response = await axios.get(jwksUri);
    return response.data.keys;
  } catch (error) {
    console.error("Erro ao obter as chaves JWKS:", error);
    return [];
  }
}

/**
 * Verifica se é permitido acesso a rota na qual foi solicitada
 * @param req Dados da requisição
 * @param res Resposta
 * @param next Controlador do middleware
 * @returns 
 */
export async function verifyAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
  const databaseConnection = await getSecurityTenantConnection();

  if (!databaseConnection) {
    res.status(500).send({ message: "Erro no servidor" });
    return;
  }

  // Verifica se é pública, se for só passa
  if (await isPublicRoute(req.method, req.originalUrl, databaseConnection)) {
    next();
    return;
  }

  // Obtém o access_token do header
  const authHeader = req.headers['authorization'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const accessToken = authHeader.split(' ')[1]; // Obtém o token após "Bearer"

    // Verifica se o token é válido, assim retorna o OID do usuário
    const userOID = await verifyAccessTokenIsValid(accessToken, res);

    // Se não retornou o OID (não tem access_token)
    if (userOID == null) {
      res.status(401).send({ message: "Acesso não autorizado. Usuário não identificado" });
    } else {
      // Se tem o OID verifica se tem permissão pra rota
      if (await isAuthorizedUrl(userOID, req.method, req.originalUrl, databaseConnection)) {
        next();
      } else {
        res.status(401).send({ message: "Acesso não autorizado. Rota não autorizada" });
      }
    }
  } else {
    res.status(401).send({ message: "Token não fornecido ou inválido" });
  }
}

/**
 * Verifica se o token de acesso é válido
 * @param accessToken 
 * @param res 
 * @returns Retorna null (caso seja um visitante ou pessoa com token inválido) ou o OID do usuário
 */
async function verifyAccessTokenIsValid(accessToken: string, res: Response): Promise<string | null> {
  if (!accessToken) {
    return null;
  }

  const JWKsUri: string | undefined = process.env.JWKsUri;
  
  if(JWKsUri == undefined){
    throw new Error("Não foi possível obter dados de ambiente");
  }

  const jwk = await getJWKS(JWKsUri);

  if (!jwk || !jwk.length) {
    // throw new Error("Chaves JWKS não encontradas ou vazias");
    return null;
  }

  const pem = jwkToPem(jwk[0]);

  try {
    // Passo o token e a key no formato pem para decodificar o token
    const decoded = jwt.verify(accessToken, pem) as any;

    const now = Math.floor(Date.now() / 1000);
    // Verifica se o token não expirou
    if (decoded.exp < now) {
      res.status(402).send({ message: "Token Expired!" });
      return null;
    }

    // Verifica se o token ainda não é válido (antes do momento atual)
    if (decoded.nbf && decoded.nbf > now) {
      res.status(403).send({ message: "Token não valido!" });
      return null;
    }

    return decoded.oid;
  } catch (error) {
    console.error("Erro ao validar o token:", error);
    return null;
  }
}

/**
 * Verifica se é o usuário está autorizado a realizar a operação a url especificada
 * @param {*} userUID Identificador do usuário
 * @param {*} method Método. @example "GET", "POST"
 * @param {*} url Url. @example "/produto"
 * @param {*} databaseConnection Conexão com o banco de dados do usuário
 * @returns 
 */
async function isAuthorizedUrl(userUID: string, method: string, url: string, databaseConnection: any): Promise<boolean | null> {

  if (await userIsAdmin(userUID, databaseConnection) == true || await isPublicRoute(method, url, databaseConnection) == true) {
    return true;
  }

  const userHaveAccessToRoute = await isUserHaveAccessToRoute(userUID, method, url, databaseConnection);
  return userHaveAccessToRoute;
}

async function isUserHaveAccessToRoute(userUID: string, method: string, url: string, databaseConnection: TenantConnection): Promise<boolean | null>{
  const functionSystemRoleService: FunctionSystemRoleService = new FunctionSystemRoleService(databaseConnection.databaseType, databaseConnection.models["functionSystemRole"]);
  return await functionSystemRoleService.isUserHaveAccessToRoute(userUID, method, url);
}

/**
 * Verifica se o usuário é administrador
 * @param userUID UID do usuário
 * @param databaseConnection Instância da conexão com o banco de dados do usuário
 * @returns Retorna se o usuário é administrador, sendo verdadeiro pra sim, falso pra não. Null caso der erros.
 */
async function userIsAdmin(userUID: string, databaseConnection: TenantConnection): Promise<boolean | null> {
  const userService: UserService = new UserService(databaseConnection.databaseType, databaseConnection.models["user"]);
  return await userService.isUserAdmin(userUID);
}

/**
 * Faz uma verificação para saber se a rota a ser usada é publica para todos os usuários ou não
 * @param {*} _method Métodos REST, exemplos: POST; GET; DELETE; PATCH ..
 * @param {*} _url Caminho, exemplos: order/:id
 * @param {*} databaseConnection Instância de conexão com o banco de dados
 * @returns Retornará um valor booleano, sendo "True" se o a rota for pública, caso contrário retornará "False"
 */
async function isPublicRoute(_method: string, _url: string, databaseConnection: TenantConnection): Promise<boolean | null> {
  const functionSystemService: FunctionSystemService = new FunctionSystemService(databaseConnection.databaseType, databaseConnection.models["functionSystemService"]);
  
  return await functionSystemService.isPublicRoute(_method, _url);
}