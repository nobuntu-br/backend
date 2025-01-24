import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { UnauthorizedError } from "../../errors/unauthorized.error";

interface ValidateTokenOptions {
  issuer: string; // O emissor esperado do token
  audience?: string; // A audiência esperada (opcional) (nesse caso é o ClientId)
  jwksUri: string;
}

interface DecodedToken extends JwtPayload {
  [key: string]: any;
}

export class ValidateAccessTokenUseCase {
  constructor(
  ) { }

  async execute(token: string, options: ValidateTokenOptions): Promise<DecodedToken> {

    const _jwksClient = jwksClient({
      jwksUri: options.jwksUri, // URL do JWK do emissor
    });

    if (token == null) {
      throw new UnauthorizedError("Token empty.");
    }

    // Decodifica o token sem verificar para extrair informações do cabeçalho
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader || typeof decodedHeader === "string") {
      throw new Error("Invalid token format");
    }

    const keyId : string | undefined = decodedHeader.header.kid;
    const algorithm: jwt.Algorithm = decodedHeader.header.alg as jwt.Algorithm;

    if (keyId == undefined) {
      throw new Error("Token missing 'kid' in header");
    }

    // Obtém a chave de assinatura correspondente
    const publicKey = await this.getSigningKey(keyId, _jwksClient);

    // Verifica e decodifica o token
    const verifiedToken = jwt.verify(token, publicKey, {
      clockTolerance: 5,
      issuer: options.issuer, //Compara se o Emissor do token é o correto
      audience: options.audience,
      algorithms: [algorithm] //Algoritmo de assinatura do JWT
    }) as DecodedToken;

    return verifiedToken;
  }

  async getSigningKey(kid: string, jwksClient: any): Promise<string>{
    return new Promise((resolve, reject) => {
      jwksClient.getSigningKey(kid, (error: Error, key: any) => {
        if (error) return reject(error);
        const signingKey = key.getPublicKey();
        resolve(signingKey);
      });
    });
  };

}