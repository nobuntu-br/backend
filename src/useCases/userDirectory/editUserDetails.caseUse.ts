import axios from 'axios';

export class EditUserDetailsUseCase {
  constructor() {}

  async execute(userDetails: {
    userId: string;
    businessPhones?: string[];
    displayName?: string;
    givenName?: string;
    jobTitle?: string;
    mobilePhone?: string;
    officeLocation?: string;
    preferredLanguage?: string;
    surname?: string;
  }): Promise<{ success: boolean, data?: any, error?: any }> {
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

      // Buscar os dados atuais do usuário pelo userId
      const userResponse = await axios.get(`https://graph.microsoft.com/v1.0/users/${userDetails.userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Se o usuário não for encontrado, retorne um erro
      if (!userResponse.data) {
        return { success: false, error: "User not found" };
      }

      // Dados para edição do usuário, mantendo valores atuais se nenhum novo for fornecido
      const userData = {
        businessPhones: userDetails.businessPhones || userResponse.data.businessPhones || [],
        displayName: userDetails.displayName || userResponse.data.displayName,
        givenName: userDetails.givenName || userResponse.data.givenName,
        jobTitle: userDetails.jobTitle || userResponse.data.jobTitle,
        mobilePhone: userDetails.mobilePhone || userResponse.data.mobilePhone,
        officeLocation: userDetails.officeLocation || userResponse.data.officeLocation,
        preferredLanguage: userDetails.preferredLanguage || userResponse.data.preferredLanguage,
        surname: userDetails.surname || userResponse.data.surname
      };

      // Requisição para atualizar os dados do usuário no Azure AD
      const updateUserResponse = await axios.patch(`https://graph.microsoft.com/v1.0/users/${userDetails.userId}`, userData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Verificar se a atualização foi bem-sucedida
      if (updateUserResponse.status === 204) {
        return { success: true };
      } else {
        return { success: false, data: updateUserResponse.data };
      }
    } catch (error: any) {
      return { success: false, error: error.response ? error.response.data : error.message };
    }
  }
}
