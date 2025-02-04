import jwt from 'jsonwebtoken';
import { NotFoundError } from '../errors/notFound.error';

export class TokenGenerator {
  private secret: string;

  constructor() {
    const secret = process.env.JWTSECRET;

    if(secret == undefined || secret == null || secret == ''){
      throw new NotFoundError("Not found secret to create JWTs");
    }
    //Secret é o segredo para fazer a assinatura digital no JWT garantindo a autenticidade do token
    this.secret = secret;
  }

  /**
   * Faz a geração do token JWT
   * @param payload Dados que podem trazer informações. Exemplo: Informações do usuário.
   * @param expiresIn Tempo até o token passar do tempo de validade.
   * @returns Retorna o JWT gerado
   */
  generateToken(payload: object, expiresIn: number): string {
    //O JWT contém metadados relacionados (Algoritmo de criptografia utilizado e tipo de token), payload e a assintura digital (secret + payload).
    return jwt.sign(payload, this.secret, { expiresIn: expiresIn });
  }

  verifyToken(token: string): object {
    try {
      //TODO deverá ser verificado no banco de dados se o token está revogado ou não.
      return jwt.verify(token, this.secret) as object;
    } catch (error){
      return new Error("Error to verify JWT. Detail: "+ error);
    }
  }

  
  revokeToken(token: string){
    //TODO deverá ser inserido em um banco de dados (mongoDb ou Redis) o token;
    //MongoDb tem um TTL index, que o dado tem prazo de validade dentro do banco de dados. Como a liderança não quer o Redis, terá de ser no mongoDb mesmo.

  }
}
