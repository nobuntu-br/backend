import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import { UnauthorizedError } from "../../../errors/unauthorized.error";
import { GetSecurityTenantConnectionUseCase } from "../../../useCases/tenant/getSecurityTenantConnection.useCase";
import { errorHandler } from "./errorHandler.middleware";
import { ValidateAccessTokenUseCase } from "../../../useCases/authentication/validateAccessToken.useCase";
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
 * Verifica se o usuário foi cadastrado de fato no servidor de identidade
 */
export async function verifyAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      return errorHandler(new UnauthorizedError("Token não fornecido ou inválido"), req, res, next);
    }

    //Obter o token de acesso
    let accessToken = req.cookies["accessToken_" + sessionUserId];

    if (accessToken == undefined) {
      return errorHandler(new UnauthorizedError("Current user not defined."), req, res, next);
    }

    accessToken = accessToken.split(' ')[1]; // Obtém o token após "Bearer"
    const validateAccessTokenUseCase: ValidateAccessTokenUseCase = new ValidateAccessTokenUseCase();
    await validateAccessTokenUseCase.execute(accessToken, {
      issuer: issuer,
      jwksUri: jwksUri,
      audience: clientId
    });

    next();
  } catch (error: any) {

    console.log(error);
    res.status(500).json({ message: "Error to authentication.", details: error || "Identificador de tenant a ser usado na operação não é válido" });
  }
}