import axios from 'axios';

export class GetUserPrincipalNameUseCase {
  constructor() {}

  async execute(email: string): Promise<{ success: boolean, data?: any, error?: any }> {
    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;

    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    if (clientId === undefined || clientSecret === undefined) {
      return { success: false, error: "Client ID or Client Secret is not defined" };
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

      // Requisição para buscar o usuário pelo email (mail ou otherMails)
      const usersResponse = await axios.get(`https://graph.microsoft.com/v1.0/users?$filter=mail eq '${email}' or otherMails/any(x:x eq '${email}')`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // Verificar se o usuário foi encontrado
      if (usersResponse.data.value && usersResponse.data.value.length > 0) {
        const userPrincipalName = usersResponse.data.value[0].userPrincipalName;

        // Retornar o userPrincipalName
        return { success: true, data: { userPrincipalName } };
      } else {
        // Se não encontrar o usuário, retornar erro
        return { success: false, error: "User not found" };
      }

    } catch (error: any) {
      // Capturar e retornar erro
      return { success: false, error: error.response ? error.response.data : error.message };
    }
  }
}
