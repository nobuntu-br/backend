import axios from 'axios';

export class ChangeUserPasswordUseCase {
  constructor() {}

  async execute(email: string, newPassword: string): Promise<{ success: boolean, data?: any, error?: any }> {
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

      // Buscar o usuário pelo e-mail usando filtro, incluindo otherMails
      const userResponse = await axios.get(`https://graph.microsoft.com/v1.0/users?$filter=mail eq '${email}' or userPrincipalName eq '${email}' or otherMails/any(x:x eq '${email}')`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (userResponse.data.value.length === 0) {
        return { success: false, error: "User not found" };
      }

      // Obter o userId do primeiro usuário encontrado
      const userId = userResponse.data.value[0].id;

      // Dados para alteração de senha do usuário
      const userData = {
        passwordProfile: {
          forceChangePasswordNextSignIn: false,
          password: newPassword
        }
      };

      // Requisição para alterar a senha do usuário no Azure AD
      const changePasswordResponse = await axios.patch(`https://graph.microsoft.com/v1.0/users/${userId}`, userData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Retornar a resposta de sucesso
      return { success: true, data: changePasswordResponse.data };
    } catch (error: any) {
      // Capturar e retornar erro
      return { success: false, error: error.response ? error.response.data : error.message };
    }
  }
}
