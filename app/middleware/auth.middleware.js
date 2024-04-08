const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../../models");
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

async function verifyToken(req, res, next) {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  const jwksUri =
    "https://allystore.b2clogin.com/allystore.onmicrosoft.com/b2c_1_susi1/discovery/keys";
  const jwk = await getJWKS(jwksUri);
  console.log(jwk);
  if (!jwk || !jwk.length) {
    throw new Error("Chaves JWKS não encontradas ou vazias");
  }

  let pem = jwkToPem(jwk[0]);
  console.log(pem);

  try {
    // Verifica o token
    // ai passo o token e a key no formato pem aqui para decodificar o token e ai ele é decodificado
    let decoded = jwt.verify(token, pem);
    // console.log(decoded);

    const now = Math.floor(Date.now() / 1000);
    // Verifica se o token não expirou
    if (decoded.exp < now) {
      return res.status(402).send({ message: "Token Expired!" });
    }

    // Verifica se o token ainda não é válido (antes do momento atual)
    if (decoded.nbf && decoded.nbf > now) {
      return res.status(403).send({ message: "Token não valido!" });
    }

    console.log("Token válido.");
  
    req.userId = decoded.oid;
    req.access_token = token;
    req.exp_token = decoded.exp;
    next();
  } catch (error) {
    console.error("Erro ao validar o token:", error.message);
    return false;
  }
}

isAuthorized = async (req, res, next) => {
  const oid = req.userId;

  try {
    //É pego da API o usuário com base no OID
    const _user = await db.users.findOne({ UID: oid }).exec();

    if (_user != null && _user.isAdministrator != null) {
      //Se o usuário é administrador
      if (_user.isAdministrator == true) {
        console.log(
          "Usuário aceito como administrador: ",
          _user.isAdministrator
        );
        next(); //Ele terá acesso a tudo
        return;
      }
    }
  } catch (error) {
    console.error("Erro ao obter o usuário. " + error);
  }

  const user = await db.users.aggregate([
    // Filtrar pelo UID do usuário
    { $match: { UID: oid } },
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
        "FunctionSystem.route": { $eq: req.method + "#" + req.originalUrl },
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
    next();
    return;
  }

  res.status(401).send({ message: "Acesso não autorizado" });
};


//Declaração das funções que serão exportadas
const authJwt = {
  verifyToken,
  isAuthorized
};

module.exports = authJwt;
