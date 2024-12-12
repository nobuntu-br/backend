import axios from "axios";
import { NotFoundError } from "../errors/notFound.error";
import { IUser } from "../models/user.model";
import { SignInOutputDTO } from "../models/DTO/signin.DTO";
import { IidentityService } from "./Iidentity.service";
import { GetUserImageOutputDTO } from "../models/DTO/getUserImage.DTO";

export interface IAzureAdUser {
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle?: string;
  mail: string;
  mobilePhone?: string;
  officeLocation?: string;
  preferredLanguage?: string;
  surname: string;
  userPrincipalName: string;
  id: string;
}

export interface IAzureUserGroup {
  id: string;
  displayName: string;
}

export class AzureADService implements IidentityService {
  private graphAPIUrl = `https://graph.microsoft.com/`;

  //Dados necessários para realizar as requisições na Azure
  private clientId: string;
  private clientSecret: string;
  private tenantID: string;
  private scope: string;
  private domainName: string;

  constructor(
  ) {

    if (
      process.env.AZURE_CLIENT_ID === undefined ||
      process.env.AZURE_CLIENT_SECRET === undefined ||
      process.env.AZURE_TENANT_ID === undefined ||
      process.env.AZURE_SCOPE === undefined ||
      process.env.AZURE_DOMAIN_NAME === undefined
    ) {
      throw new NotFoundError("Dados relacionados as requisições nos serviços da Azure não estão contidos nas variáveis ambiente");
    }

    this.clientId = process.env.AZURE_CLIENT_ID;
    this.clientSecret = process.env.AZURE_CLIENT_SECRET;
    this.tenantID = process.env.AZURE_TENANT_ID;
    this.scope = process.env.AZURE_SCOPE;
    this.domainName = process.env.AZURE_DOMAIN_NAME;
  }

  /**
   * obter o token de acesso da Microsoft Graph API
   * @returns Retorna o token de acesso da Microsoft Graph API
   */
  async getAccessToken(): Promise<string> {
    try {
      const getTokenUrl = `https://login.microsoftonline.com/${this.tenantID}/oauth2/v2.0/token`;

      const urlSearchParams = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: 'client_credentials'
      });

      // Obter o access token
      const tokenResponse = await axios.post(getTokenUrl, urlSearchParams.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const accessToken: string = tokenResponse.data.access_token;

      return accessToken;
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
      }
      throw new Error("Erro ao obter o accessToken do serviço Azure. Detalhes: " + error);
    }
  }

  async getUserGroups(userId: string): Promise<IAzureUserGroup[]> {
    try {

      const accessToken: string = await this.getAccessToken();

      const userResponse = await axios.get(this.graphAPIUrl + `v1.0/users/` + userId + `/memberOf`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      //É retornado pela Azure um Array com todos os grupos que o usuário faz parte
      if (userResponse.data.value.length > 0 && userResponse.data.value[0] != null) {
        var userGroups : IAzureUserGroup[] = [];

        userResponse.data.value.forEach((group : any) => {
          userGroups.push({
            id: group.id,
            displayName: group.displayName
          })
        });

        return userGroups;
      }

      throw new NotFoundError("Nenhum usuário encontrado");
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const policies = 'b2c_1_ropc';

    try {
      //TODO definir o link no .env também, muitas coisas pra por lá. ai ai
      const getTokenUrl = 'https://allystore.b2clogin.com/' + this.domainName + '/oauth2/v2.0/token?p=' + policies;

      const urlSearchParams = new URLSearchParams({
        client_id: this.clientId,
        refresh_token: refreshToken,
        // scope: 'https://' + this.domainName + '/tasks-api2/tasks.read openid' + " offline_access",
        scope: 'https://' + this.domainName + this.scope + ' openid offline_access',
        grant_type: 'refresh_token'
      });

      // Obter o access token
      const tokenResponse = await axios.post(getTokenUrl, urlSearchParams.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const accessToken: string = tokenResponse.data.access_token;

      return accessToken;
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
      }
      throw new Error("Erro ao obter o accessToken do serviço Azure. Detalhes: " + error);
    }
  }

  async getUserByEmail(email: string): Promise<IUser> {
    try {

      const accessToken: string = await this.getAccessToken();

      // Buscar o usuário pelo e-mail usando filtro, incluindo otherMails
      const userResponse = await axios.get(this.graphAPIUrl + `v1.0/users?$filter=mail eq '${email}' or userPrincipalName eq '${email}' or otherMails/any(x:x eq '${email}')`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      //TODO tem casos que retorna mais de um, isso não pode ocorrer, ver isso na Azure.
      if (userResponse.data.value.length > 0 && userResponse.data.value[0] != null) {

        return {
          email: email,
          firstName: userResponse.data.value[0].givenName,
          lastName: userResponse.data.value[0].surname,
          UID: userResponse.data.value[0].id,
          userName: userResponse.data.value[0].displayName,
          tenantUID: this.tenantID
        }
      }

      throw new NotFoundError("Nenhum usuário encontrado");
    } catch (error) {

      throw error;
    }

  }

  async createUser(user: IUser): Promise<IUser> {

    try {
      const graphAPIUrl = 'https://graph.microsoft.com/v1.0/users';

      const accessToken: string = await this.getAccessToken();

      const domainName: string = await this.getDomainName(accessToken);

      console.log(user);

      const _user = {
        accountEnabled: true,
        displayName: user.userName,
        mailNickname: this.getUsernameFromEmail(user.email!),
        userPrincipalName: this.getUsernameFromEmail(user.email!) + "@" + this.domainName,//TODO tem que ser dominio do azure AD
        passwordProfile: {
          forceChangePasswordNextSignIn: false,//Aqui estava como verdadeiro
          password: user.password
        },
        //Como pode ser usado um domíno que não seja da Azure, teria que criar contra e associar ao dominio externo
        identities: [
          {
            signInType: "emailAddress",
            issuer: domainName,
            issuerAssignedId: user.email
          }
        ],
        mail: user.email
      };
      // Requisição para criar o usuário no Azure AD
      const createUserResponse = await axios.post(graphAPIUrl, _user, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        email: createUserResponse.data.mail,
        firstName: createUserResponse.data.givenName,
        lastName: createUserResponse.data.surname,
        UID: createUserResponse.data.id,
        userName: createUserResponse.data.displayName,
      }
    } catch (error: any) {
      console.dir(error, { depth: null });
      throw new Error("Erro ao criar o usuário. Detalhes: " + error);
    }

  }

  async loginUser(username: string, password: string): Promise<SignInOutputDTO> {

    const urlSearchParams = new URLSearchParams({
      'grant_type': 'password',
      'client_id': this.clientId,
      'username': username,
      'password': password,
      // deve incluir openid para obter o token de ID e offline_access para obter o refresh token
      'scope': this.scope + ' openid offline_access' //Esse é o padrão
    });

    try {

      const loginUserResponse = await axios.post('https://allystore.b2clogin.com/' + this.domainName + '/oauth2/v2.0/token?p=b2c_1_ropc', urlSearchParams.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      });

      const profile = this.parseJwt(loginUserResponse.data.access_token);

      return {
        user: {
          UID: profile.sub,
          tenantUID: this.tenantID,
          userName: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: username
        },
        tokens: {
          accessToken: loginUserResponse.data.access_token,
          refreshToken: loginUserResponse.data.refresh_token,
          tokenType: loginUserResponse.data.token_type,
          expiresAt: loginUserResponse.data.expires_at,
        }
      }
    } catch (error: any) {
      // console.log(error);
      if (error.response) {
        console.log(error.response.data);
      }
      throw error;
    }

  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  async updateUser(user: IUser): Promise<IUser> {
    // // Requisição para atualizar os dados do usuário no Azure AD
    // const updateUserResponse = await axios.patch(`https://graph.microsoft.com/v1.0/users/${userDetails.userId}`, userData, {
    //   headers: {
    //     'Authorization': `Bearer ${accessToken}`,
    //     'Content-Type': 'application/json'
    //   }
    // });

    // // Verificar se a atualização foi bem-sucedida
    // if (updateUserResponse.status === 204) {

    // }
    throw new Error("Método não implementado");
  }

  async changeUserPassword(userUID: string, newPassword: string): Promise<string> {

    try {
      const accessToken: string = await this.getAccessToken();

      const body = {
        "passwordProfile": {
          "forceChangePasswordNextSignIn": false,
          "password": newPassword
        }
      }

      // Altera senha do usuário
      const updateUserPasswordResponse = await axios.patch(this.graphAPIUrl + `v1.0/users/` + userUID, body, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
      });

      return userUID;

    } catch (error: any) {
      console.dir(error.response.data, { depth: null });
      throw new Error("Erro ao alterar senha do usuário na Azure. Detalhes: " + error);
    }

  }

  async deleteUser(userID: string): Promise<string> {
    const accessToken: string = await this.getAccessToken();

    // Criará o usuário
    const updateUserResponse = await axios.post(this.graphAPIUrl + `v1.0/users` + userID, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });

    console.log("Retorno da atualização de dados do usuário na Azure: ", updateUserResponse);

    if (updateUserResponse.status === 204) {
      return userID;
    }

    throw new Error("Erro ao fazer a remoção do usuário na Azure.");

  }

  getUsernameFromEmail(email: string): string {
    const atIndex = email.indexOf('@');

    // Se não encontrar o '@', retorne uma string vazia ou um erro
    if (atIndex === -1) {
      throw new Error('Email inválido');
    }

    return email.substring(0, atIndex);
  }

  async getDomainName(accessToken: string) {

    // Requisição para obter as informações da organização (incluindo o domínio)
    const organizationResponse = await axios.get('https://graph.microsoft.com/v1.0/organization', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Extrair o domínio principal
    const domainName = organizationResponse.data.value[0].verifiedDomains.find((domain: any) => domain.isDefault).name;
    return domainName;
  }

  async getApplications(accessToken: string) {

    try {
      const response = await axios.get('https://graph.microsoft.com/v1.0/applications', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log('Aplicações Registradas:', response.data.value);

      return response.data.value;
    } catch (error: any) {
      console.error('Erro ao obter as aplicações:', error.response.data);
    }
  }

  async getUserImage(userID: string): Promise<GetUserImageOutputDTO>{
    try {
      const accessToken: string = await this.getAccessToken();

      // Buscar o usuário pelo e-mail usando filtro, incluindo otherMails
      const userResponse = await axios.get(this.graphAPIUrl + "v1.0/users/"+ userID + "/photo/$value", {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.dir(userResponse.data, { depth: null });

      return {imageUrl: "ddd"};

      throw new NotFoundError("Nenhum usuário encontrado");
    } catch (error: any) {
      console.dir(error.response.data, { depth: null });
      throw error;
    }
  }
}