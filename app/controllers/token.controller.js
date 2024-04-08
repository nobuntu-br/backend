const axios = require("axios");

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