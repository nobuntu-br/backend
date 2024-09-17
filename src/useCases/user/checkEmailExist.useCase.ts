import axios from "axios";
import { NotFoundError } from "../../errors/notFound.error";

export class CheckEmailExistUseCase {
  constructor() {
    //Caso precise usar algum Service de uma classe existente para salvar no banco de dados, fazer a adição aqui
  }

  async execute(email: string): Promise<boolean> {
    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;

    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    if (clientId === undefined || clientSecret === undefined) {
      throw new NotFoundError("Client ID or Client Secret is not defined");
    }

    const data = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
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

      // Buscar o usuário pelo e-mail usando filtro, incluindo otherMails
      const userResponse = await axios.get(`https://graph.microsoft.com/v1.0/users?$filter=mail eq '${email}' or userPrincipalName eq '${email}' or otherMails/any(x:x eq '${email}')`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Verificar se o usuário foi encontrado
      if (userResponse.data.value.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error("Falha ao verificar a existência do email. "+error);
    }
  }

}


