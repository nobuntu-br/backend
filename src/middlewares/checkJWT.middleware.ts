//Pacote com operações de validação para JWT
var { expressjwt: expressjwt } = require("express-jwt");
//Pacote com operações de chamada de JWKS para validar o JWT
var { jwksRsa } = require('jwks-rsa');

/**
 * 
 * @param jwksUri link que será requisitado o JWKS para validar o JWT
 * @param jwt javascript web token
 * @returns 
 */
export function checkJwt(_jwksUri: string, tenantName: string){
  return expressjwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      // jwksUri: `https://<tenant_name>.b2clogin.com/<tenant_name>.onmicrosoft.com/discovery/v2.0/keys`,
      jwksUri: _jwksUri
    }),
    audience: "https://"+tenantName+".onmicrosoft.com/api",
    issuer: "https://"+tenantName+".b2clogin.com/<tenant_name>.onmicrosoft.com/v2.0/",
    algorithms: ['RS256'],
  });
}
