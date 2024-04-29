const jwt = require("jsonwebtoken");
const db = require("../../models/index.js");
const axios = require("axios");
const jwkToPem = require("jwk-to-pem");

async function getJWKS(jwksUri) {
  try {
    const response = await axios.get(jwksUri);
    return response.data.keys;
  } catch (error) {
    console.error("Erro ao obter as chaves JWKS:", error);
    return null;
  }
}

/**
 * Verifica se é permitido acesso a rota na qual foi solicitada
 * @param {*} req Dados da requisição
 * @param {*} res Resposta
 * @param {*} next Controlador do middleware
 * @returns 
 */
async function verifyAccess(req, res, next) {

  //Verifica se é publica, se for só passa
  if (await isPublicRoute(req.method, req.originalUrl) == true) {
    next();
    return;
  }

  //Obtem o access_token do header
  const access_token = req.headers["authorization"];

  //Verifica se o token é valido, assim retorna o OID do usuário
  const userOID = await verifyAccessTokenIsValid(access_token, res);

  //Se não retornou o OID (não tem access_token)
  if (userOID == null) {
    res.status(401).send({ message: "Acesso não autorizado" });
  } else {
    //Se tem o OID verifica se tem permissao pra rota
    if (await isAuthorizedOnUrl(userOID, req.method, req.originalUrl) == true) {
      next();
    } else {
      console.log("não é autorizado")
      res.status(401).send({ message: "Acesso não autorizado" });
    }
  }

  return;
}

/**
 * Verifica se o token de acesso é valido
 * @param {*} access_token 
 * @returns Retorna null (caso seja um visitante ou pessoa com token inválido) ou o OID do usuário
 */
async function verifyAccessTokenIsValid(access_token, res) {
  if (!access_token) {
    return null;
  }

  const JWKsUri = process.env.JWKsUri;

  const jwk = await getJWKS(JWKsUri);

  if (!jwk || !jwk.length) {
    // throw new Error("Chaves JWKS não encontradas ou vazias");
    return null;
  }

  let pem = jwkToPem(jwk[0]);

  try {
    // ai passo o token e a key no formato pem aqui para decodificar o token e ai ele é decodificado
    let decoded = jwt.verify(access_token, pem);

    const now = Math.floor(Date.now() / 1000);
    // Verifica se o token não expirou
    if (decoded.exp < now) {
      return res.status(402).send({ message: "Token Expired!" });
    }

    // Verifica se o token ainda não é válido (antes do momento atual)
    if (decoded.nbf && decoded.nbf > now) {
      return res.status(403).send({ message: "Token não valido!" });
    }

    return decoded.oid;

  } catch (error) {
    console.error("Erro ao validar o token:", error.message);
    return null;
  }
}

/**
 * Verifica se é o usuário está autorizado a realizar a operação a url especificada
 * @param {*} userOID Identificador do usuário
 * @param {*} _method Método. @example "GET", "POST"
 * @param {*} _url Url. @example "/produto"
 * @returns 
 */
async function isAuthorizedOnUrl(userOID, _method, _url) {

  if (await userIsAdmin(userOID) == true) {
    return true;
  }

  const user = await db.users.aggregate([
    // Filtrar pelo UID do usuário
    { $match: { UID: userOID } },
    // Fazer o lookup para obter os detalhes das roles
    {
      $lookup: {
        from: "roles",
        localField: "Roles",
        foreignField: "_id",
        as: "Roles",
      },
    },

    // Desconstruir o array de rolesDetails
    { $unwind: "$Roles" },
    // Fazer o lookup para obter os detalhes das functionSystemRoles
    {
      $lookup: {
        from: "functionssystemroles",
        localField: "Roles.FunctionSystemRoles",
        foreignField: "_id",
        as: "FunctionSystemRoles",
      },
    },

    { $unwind: "$FunctionSystemRoles" },

    {
      $match: {
        "FunctionSystemRoles.authorized": true,
      },
    },
    {
      $lookup: {
        from: "functionssystems",
        localField: "FunctionSystemRoles.FunctionSystem",
        foreignField: "_id",
        as: "FunctionSystem",
      },
    },

    { $unwind: "$FunctionSystem" },

    {
      $match: {
        "FunctionSystem.route": { $eq: _method + "#" + _url },
      },
    },

    {
      $project: {
        UID: 1,
        NomeDaRole: "$Roles.name",
        isAuthorized: "$FunctionSystemRoles.authorized",
        FunctionSystemRoute: "$FunctionSystem.route",
      },
    },
  ]);

  if (user != null && user.length > 0) {
    return true;
  }

  return false;
};

async function userIsAdmin(userOID) {
  try {
    //É pego da API o usuário com base no OID
    const _user = await db.users.findOne({ UID: userOID }).exec();

    if (_user != null && _user.isAdministrator != null) {
      //Se o usuário é administrador
      if (_user.isAdministrator == true) {
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao obter o usuário. " + error);
    return false;
  }
}

async function isPublicRoute(_method, _url) {

  const role = await db.roles.aggregate([
    { $match: { name: "guest" } },

    {
      $lookup: {
        from: "functionssystemroles",
        localField: "FunctionSystemRoles",
        foreignField: "_id",
        as: "FunctionSystemRoles",
      },
    },

    { $unwind: "$FunctionSystemRoles" },

    {
      $match: {
        "FunctionSystemRoles.authorized": true,
      },
    },
    {
      $lookup: {
        from: "functionssystems",
        localField: "FunctionSystemRoles.FunctionSystem",
        foreignField: "_id",
        as: "FunctionSystem",
      },
    },

    { $unwind: "$FunctionSystem" },

    {
      $match: {
        "FunctionSystem.route": { $eq: _method + "#" + _url },
      },
    },

    {
      $project: {
        name: 1,
        NomeDaRole: "$Roles.name",
        isAuthorized: "$FunctionSystemRoles.authorized",
        FunctionSystemRoute: "$FunctionSystem.route",
      },
    },
  ]);

  if (role != null && role.length > 0) {
    return true;
  }

  return false;
}


//Declaração das funções que serão exportadas
const auth = {
  isPublicRoute,
  isAuthorizedOnUrl,
  verifyAccess,
  verifyAccessTokenIsValid
};

module.exports = auth;