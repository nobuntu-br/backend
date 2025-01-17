import axios from "axios";
import { NotFoundError } from "../../errors/notFound.error";
import { ValidationError } from "../../errors/validation.error";
import { SignInOutputDTO } from "../../useCases/authentication/signIn.useCase";
import { GetUserProfilePhotoOutputDTO } from "../../useCases/user/getUserProfilePhoto.useCase";
import { IUser } from "../entities/user.model";
import { IidentityService } from "./Iidentity.service";

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
  private authenticationFlowDomainName: string;

  constructor(
  ) {

    if (
      process.env.CLIENT_ID === undefined ||
      process.env.CLIENT_SECRET === undefined ||
      process.env.TENANT_ID === undefined ||
      process.env.SCOPE === undefined ||
      process.env.DOMAIN_NAME === undefined ||
      process.env.AUTHENTICATION_FLOW_DOMAIN_NAME === undefined
    ) {
      throw new NotFoundError("Dados relacionados as requisições nos serviços da Azure não estão contidos nas variáveis ambiente");
    }

    this.clientId = process.env.CLIENT_ID;
    this.clientSecret = process.env.CLIENT_SECRET;
    this.tenantID = process.env.TENANT_ID;
    this.scope = process.env.SCOPE;
    this.domainName = process.env.DOMAIN_NAME;
    this.authenticationFlowDomainName = process.env.AUTHENTICATION_FLOW_DOMAIN_NAME;
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

      console.log("get user groups");
      console.log(userResponse.data);

      //É retornado pela Azure um Array com todos os grupos que o usuário faz parte
      if (userResponse.data.value.length > 0 && userResponse.data.value[0] != null) {
        var userGroups: IAzureUserGroup[] = [];

        userResponse.data.value.forEach((group: any) => {
          userGroups.push({
            id: group.id,
            displayName: group.displayName
          })
        });

        return userGroups;
      }

      throw new NotFoundError("Nenhum usuário encontrado");
    } catch (error: any) {
      console.log(error.data);
      console.dir(error, { depth: null });
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<SignInOutputDTO> {
    try {
      const tokenEndpoint = `https://${this.authenticationFlowDomainName}/${this.tenantID}/oauth2/v2.0/token?p=b2c_1_ropc`;

      const urlSearchParams = new URLSearchParams({
        'grant_type': 'refresh_token',
        'client_id': this.clientId,
        'refresh_token': refreshToken,
        'scope': this.scope + ' openid offline_access'
      });

      // Realiza a requisição no servidor da Azure para obter o novo access token
      const tokenResponse = await axios.post(tokenEndpoint, urlSearchParams.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      //Informações detalhadas do perfil do usuário autenticado.
      const userData = this.parseJwt(tokenResponse.data.access_token);

      const accessData: SignInOutputDTO = {
        user: {
          UID: userData.sub,
          tenantUID: "",
          userName: userData.name,
          firstName: userData.given_name,
          lastName: userData.family_name,
          email: ""
        },
        tokens: {
          accessToken: tokenResponse.data.access_token,
          refreshToken: tokenResponse.data.refresh_token,
          tokenType: tokenResponse.data.token_type,
          expiresIn: tokenResponse.data.expires_in,
          expiresOn: tokenResponse.data.expires_on,
          refreshTokenExpiresIn: tokenResponse.data.refresh_token_expires_in
        }
      }

      return accessData;

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

      const _user = {
        accountEnabled: true,
        displayName: user.userName,//Nome completo
        givenName: user.firstName,
        surname: user.lastName,
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
      throw new Error("Error to create user on Azure services.");
    }

  }

  async signIn(username: string, password: string): Promise<SignInOutputDTO> {

    const urlSearchParams = new URLSearchParams({
      'grant_type': 'password',
      'client_id': this.clientId,
      'username': username,
      'password': password,
      // deve incluir openid para obter o token de ID e offline_access para obter o refresh token
      'scope': this.scope + ' openid offline_access'
    });

    try {

      const signInResponse = await axios.post(`https://${this.authenticationFlowDomainName}/${this.domainName}/oauth2/v2.0/token?p=b2c_1_ropc`, urlSearchParams.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      });

      //Informações detalhadas do perfil do usuário autenticado.
      const userData = this.parseJwt(signInResponse.data.access_token);

      return {
        user: {
          UID: userData.sub,
          tenantUID: "",
          userName: userData.name,
          firstName: userData.given_name,
          lastName: userData.family_name,
          email: ""
        },
        tokens: {
          accessToken: signInResponse.data.access_token,
          refreshToken: signInResponse.data.refresh_token,
          tokenType: signInResponse.data.token_type,
          expiresIn: signInResponse.data.expires_in,
          expiresOn: signInResponse.data.expires_on,
          refreshTokenExpiresIn: signInResponse.data.refresh_token_expires_in
        }
      }
    } catch (error: any) {
      console.log(error.response);

      if (error.response.status == 400) {
        throw new ValidationError("Error to access account.")
      }

      throw error;
    }

  }

  async signOut(accessToken: string, refreshToken: string | null): Promise<boolean> {
    const urlSearchParams = new URLSearchParams({
      'grant_type': 'password',
      'client_id': this.clientId,
      'token': accessToken,
      "refresh_token": refreshToken != null ? refreshToken : "",
    });

    try {
      const signInResponse = await axios.post(`https://${this.authenticationFlowDomainName}/${this.domainName}/oauth2/v2.0/logout?p=b2c_1_ropc`, urlSearchParams.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      });

      return true;

    } catch (error) {
      console.log("Erro ao realizar a requisição de logout pra Azure. Details: "+ error);
      throw new Error("Error to signout user on Azure Indentity Server. Detail: "+ error);
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

  async resetUserPassword(userUID: string, newPassword: string): Promise<string> {

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

  async getUserProfilePhoto(userID: string): Promise<GetUserProfilePhotoOutputDTO> {
    try {
      const accessToken: string = await this.getAccessToken();

      // Requisição para obter imagem de perfil do usuário no servidor da Azure
      const userResponse = await axios.get(this.graphAPIUrl + "v1.0/users/" + userID + "/photo", {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.dir(userResponse.data, { depth: null });

      return { imageUrl: "ddd" };

      throw new NotFoundError("Nenhum usuário encontrado");
    } catch (error: any) {
      console.dir(error.response.data, { depth: null });
      throw error;
    }
  }

  //Requer permissão User.ReadWrite.All ativo
  async updateUserProfilePhoto(accessToken: string, photoBlob: Blob): Promise<boolean> {
    try {
      // Requisição para alterar imagem de perfil do usuário no servidor da Azure
      const userResponse = await axios.put(this.graphAPIUrl + "v1.0/me/photo/$value", photoBlob, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': "image/jpeg"
        }
      });

      return true;

      throw new NotFoundError("Nenhum usuário encontrado");
    } catch (error: any) {
      console.dir(error.response.data, { depth: null });
      throw error;
    }
  }
}