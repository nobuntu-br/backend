import axios from 'axios';
import { UserDirectoryDTO } from '../../models/DTO/userDirectory.DTO';

export class CreateUserInDirectoryUseCase {
  constructor() {}

  async execute(userDirectory: UserDirectoryDTO): Promise<{ success: boolean, data?: any, error?: any }> {
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

      // Requisição para obter as informações da organização (incluindo o domínio)
      const organizationResponse = await axios.get('https://graph.microsoft.com/v1.0/organization', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // Extrair o domínio principal
      const domainName = organizationResponse.data.value[0].verifiedDomains.find((domain: any) => domain.isDefault).name;

      // Dados para criação do usuário
      const userData = {
        accountEnabled: true,
        displayName: userDirectory.displayName,
        surname: userDirectory.surname,
        givenName: userDirectory.givenName,
        mailNickname: userDirectory.mailNickname,
        userPrincipalName: userDirectory.userPrincipalName,
        passwordProfile: {
          forceChangePasswordNextSignIn: false,
          password: userDirectory.password
        },
        identities: [
          {
            signInType: "emailAddress",
            issuer: domainName,
            issuerAssignedId: userDirectory.email
          }
        ],
        mail: userDirectory.email
      };

      // Requisição para criar o usuário no Azure AD
      const createUserResponse = await axios.post('https://graph.microsoft.com/v1.0/users', userData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Retornar sucesso
      return { success: true, data: createUserResponse.data };
    } catch (error: any) {
      // Capturar e retornar erro
      return { success: false, error: error.response ? error.response.data : error.message };
    }
  }
}
