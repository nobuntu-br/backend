import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../../errors/unauthorized.error";
import { errorHandler } from "./errorHandler.middleware";
import { ValidateAccessTokenUseCase } from "../../../useCases/authentication/validateAccessToken.useCase";
import { checkEnvironmentVariableIsEmpty } from "../../../utils/verifiers.util";

/**
 * Verifica se o usuário foi cadastrado de fato no servidor de identidade
 */
export async function verifyAccess(req: Request, res: Response, next: NextFunction): Promise<void> {

  const clientId = process.env.CLIENT_ID;
  const issuer = process.env.TOKEN_ISSUER;
  const jwksUri = process.env.JWKsUri;

  if (checkEnvironmentVariableIsEmpty(clientId!) == true ||
    checkEnvironmentVariableIsEmpty(issuer!) == true ||
    checkEnvironmentVariableIsEmpty(jwksUri!) == true) {
    throw new Error("Populate Azure environment variables.");
  }

  try {

    //Obter usuário da sessão atual
    const sessionUserId = req.headers["usersession"];

    let accessToken;

    if (sessionUserId == undefined || sessionUserId == null || isNaN(Number(sessionUserId))) {
      // return errorHandler(new UnauthorizedError("Token não fornecido ou inválido"), req, res, next);

      //Pegar qualquer token de acesso dos cookies
      for (const [key, _accessToken] of Object.entries(req.cookies)) {
        if (key.startsWith("accessToken_")) {
          accessToken = _accessToken;
        }
      }

    } else {
      //Obter o token de acesso
      accessToken = req.cookies["accessToken_" + sessionUserId];
    }

    if (accessToken == undefined) {
      return errorHandler(new UnauthorizedError("Invalid access token."), req, res, next);
    }

    accessToken = accessToken.split(' ')[1]; // Obtém o token após "Bearer"
    const validateAccessTokenUseCase: ValidateAccessTokenUseCase = new ValidateAccessTokenUseCase();
    await validateAccessTokenUseCase.execute(accessToken, {
      issuer: issuer!,
      jwksUri: jwksUri!,
      audience: clientId
    });

    next();
  } catch (error: any) {

    console.log(error);
    res.status(500).json({ message: "Error to authentication.", details: error || "Identificador de tenant a ser usado na operação não é válido" });
  }
}