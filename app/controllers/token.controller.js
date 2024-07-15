const axios = require("axios");
require('dotenv').config();//adicionado
/**
 * Função que irá gerar o access token para o usuário acessar essa API
 */
exports.generateAcessToken = async (req, res, next) => {
  const url = process.env.TOKEN_URL;
  const code = req.headers.code;

  if(code == null){
    res.status(400).send({
      message: "Ocorreu um erro ao obter o access token"
    });
  }

  const params = {
    grant_type: process.env.GRANT_TYPE,
    client_id: process.env.CLIENT_ID,
    scope: process.env.SCOPE,
    code: code,
    redirect_uri: process.env.REDIRECT_URI,
    client_secret: process.env.CLIENT_SECRET,
  };

  try {
    console.log(params);

    const resposta = await axios.post(url, null, { params });
    res.status(200).send({
      access_token: resposta.data.access_token,
      refresh_token: resposta.data.refresh_token
    });

  } catch (erro) {
    res.status(400).send({
      message: "Ocorreu um erro ao obter o access token com axios" + erro
    });
  }
};


exports.generateAcessTokenByRefreshToken = async (req, res, next) => {
  const url = process.env.TOKEN_URL;

  const refresh_token = req.headers.refresh_token
  if(refresh_token == null){
    res.status(400).send({
      message: "Ocorreu um erro ao obter o access token"
    });
  }

  const params = {
    grant_type: process.env.GRANT_TYPE_REFRESH,
    client_id: process.env.CLIENT_ID,
    scope: process.env.SCOPE,
    refresh_token: refresh_token,
    client_secret: process.env.CLIENT_SECRET,
  };

  try {
    const resposta = await axios.post(url, null, { params });
    res.status(200).send({
      access_token: resposta.data.access_token,
      refresh_token: resposta.data.refresh_token
    });

  } catch (erro) {
    res.status(400).send({
      message: "Ocorreu um erro ao obter o access token com axios" + erro
    });
  }
};


exports.getApplicationsFromDirectory = async (req, res) => {
  const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
  const data = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    scope: 'https://graph.microsoft.com/.default'
  });

  try {
    // Obter o access token
    const tokenResponse = await axios.post(tokenUrl, data.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Buscar todas as aplicações do tenant
    const applicationsResponse = await axios.get('https://graph.microsoft.com/v1.0/applications', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Filtrar aplicações e remover 'b2c-extensions-app'
    const applications = applicationsResponse.data.value.filter(app => app.displayName !== 'b2c-extensions-app. Do not modify. Used by AADB2C for storing user data.');

    // Preparar array para armazenar detalhes de cada aplicação
    const applicationDetails = [];

    // Iterar sobre cada aplicação e buscar detalhes
    for (const app of applications) {
      // Verificar se a aplicação possui configuração SPA
      if (app.spa) {
        // Obter a primeira URI de redirecionamento do SPA
        const redirect_uri = app.spa.redirectUris && app.spa.redirectUris.length > 0 ? app.spa.redirectUris[0] : null;

        // Buscar os escopos de permissão do OAuth2
        const apiPermissions = app.api && app.api.oauth2PermissionScopes ? app.api.oauth2PermissionScopes : [];
        const scopes = apiPermissions.filter(scope => scope.type === "Admin").map(scope => scope.value);

        // Construir objeto com detalhes da aplicação
        const appDetail = {
          displayName: app.displayName,
          icon: app.info && app.info.logoUrl ? app.info.logoUrl : null,
          redirect_uri: redirect_uri,
          client_id: app.appId,
          scope: (app.identifierUris && app.identifierUris.length > 0 && scopes.length > 0) 
                   ? `openid profile ${app.identifierUris[0]}/${scopes[0]}` 
                   : null,
          post_logout_redirect_uri: app.web && app.web.logoutUrl ? app.web.logoutUrl : null
        };

        // Adicionar detalhes da aplicação ao array
        applicationDetails.push(appDetail);
      }
    }

    // Retornar os detalhes das aplicações na resposta
    res.json(applicationDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}