import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../../errors/unauthorized.error";
import { ValidateAccessTokenUseCase } from "../../../useCases/authentication/validateAccessToken.useCase";
import { getTenantConnection } from "../../database/database.config";
import { InsufficientPermissionError } from "../../../errors/insufficientPermission.error";
import { errorHandler } from "./errorHandler.middleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import TenantConnection from "../../../domain/entities/tenantConnection.model";
import FunctionSystemRoleRepository from "../../../domain/repositories/functionSystemRole.repository";
import UserRepository from "../../../domain/repositories/user.repository";
import RoleRepository from "../../../domain/repositories/role.repository";

/**
 * Middleware criado para:
 * -> Validar o usuário;
 * -> Validar se usuário tem acesso ao Tenant;
 * -> Validar se usuário tem acesso a rota;
 * Retorna ao corpo da requisição o tenant;
 */
export async function checkUserAccess(req: Request, res: Response, next: NextFunction) {

  const clientId = process.env.CLIENT_ID;
  const issuer = process.env.TOKEN_ISSUER;
  const jwksUri = process.env.JWKsUri;

  if (clientId == undefined || issuer == undefined || jwksUri == undefined) {
    throw new Error("Populate Azure environment variables.");
  }

  try {

    //Obter usuário da sessão atual
    const sessionUserId = req.headers["usersession"];

    if (sessionUserId == undefined || sessionUserId == null || isNaN(Number(sessionUserId))) {
      return errorHandler(new UnauthorizedError("usersession not defined or invalid."), req, res, next);
    }

    //Obter o token de acesso
    let accessToken = req.cookies["accessToken_" + sessionUserId];

    if (accessToken == undefined) {
      return errorHandler(new UnauthorizedError("accessToken not defined or invalid."), req, res, next);
    }

    accessToken = accessToken.split(' ')[1]; // Obtém o token após "Bearer"

    //Obter o tenant
    const databaseCredentialId: number = Number(req.header('X-Tenant-ID'));

    if (isNaN(databaseCredentialId)) {
      return errorHandler(new UnauthorizedError("Identificador de Tenant não fornecido ou inválido"), req, res, next);
    }

    const validateAccessTokenUseCase: ValidateAccessTokenUseCase = new ValidateAccessTokenUseCase();
    await validateAccessTokenUseCase.execute(accessToken, {
      issuer: issuer,
      jwksUri: jwksUri,
      audience: clientId
    });

    // Decodifica o token sem verificar a assinatura
    const decoded = jwt.decode(accessToken) as JwtPayload;

    //Obter o tenant
    const tenantConnection: TenantConnection | null = await getTenantConnection(databaseCredentialId, decoded.sub!);

    if (tenantConnection == null) {
      return errorHandler(new UnauthorizedError("Tenant não encontrado."), req, res, next);
    }

    //Verificar acesso a rota
    const _isUserHaveAccessToRoute = await isUserHaveAccessToRoute(Number(sessionUserId), req.method, req.originalUrl, tenantConnection);

    if (_isUserHaveAccessToRoute == null || _isUserHaveAccessToRoute == false) {
      return errorHandler(new InsufficientPermissionError("Usuário não tem permissão para rota."), req, res, next);
    }

    req.body.tenantConnection = tenantConnection;

    next();
  } catch (error: any) {

    console.log(error);
    return res.status(500).json({ message: "Error to authentication.", details: error || "Identificador de tenant a ser usado na operação não é válido" });
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
async function isUserHaveAccessToRoute(userId: number, method: string, url: string, databaseConnection: TenantConnection): Promise<boolean | null> {

  if (await isUserAdmin(userId, databaseConnection) == true || await isPublicRoute(method, url, databaseConnection) == true) {
    return true;
  }

  //TODO no futuro implementar com uso de cache em um banco separado (Redis)
  const functionSystemRoleRepository: FunctionSystemRoleRepository = new FunctionSystemRoleRepository(databaseConnection);
  const isUserHaveAccessToRoute: boolean | null = await functionSystemRoleRepository.isUserHaveAccessToRouteByUserId(userId, method, url);

  if (isUserHaveAccessToRoute == null) {
    return false;
  }

  return isUserHaveAccessToRoute;
}

/**
 * Verifica se o usuário é administrador
 * @param userId Id do usuário
 * @param databaseConnection Instância da conexão com o banco de dados do usuário
 * @returns Retorna se o usuário é administrador, sendo verdadeiro pra sim, falso pra não. Null caso der erros.
 */
async function isUserAdmin(userId: number, databaseConnection: TenantConnection): Promise<boolean | null> {
  //TODO no futuro implementar com uso de cache
  const userRepository: UserRepository = new UserRepository(databaseConnection);
  return await userRepository.isUserAdminById(userId);
}

/**
 * Faz uma verificação para saber se a rota a ser usada é publica para todos os usuários ou não
 * @param {*} method Métodos REST, exemplos: POST; GET; DELETE; PATCH ..
 * @param {*} url Caminho, exemplos: order/:id
 * @param {*} databaseConnection Instância de conexão com o banco de dados
 * @returns Retornará um valor booleano, sendo "True" se o a rota for pública, caso contrário retornará "False"
 */
async function isPublicRoute(method: string, url: string, databaseConnection: TenantConnection): Promise<boolean | null> {
  //TODO se for pra fazer isso, tem que ser com cache
  // const functionSystemRoleRepository: FunctionSystemRoleRepository = new FunctionSystemRoleRepository(databaseConnection);
  // return await functionSystemRoleRepository.ad.isPublicRoute(method, url);
  const roleRepository: RoleRepository = new RoleRepository(databaseConnection);
  return await roleRepository.advancedSearches.isPublicRoute(method, url);
}