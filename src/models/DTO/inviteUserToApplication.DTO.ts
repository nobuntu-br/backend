export interface InviteUserToApplicationDTO {
  invitingUserUID: string;
  invitingUserEmail: string;//Email do usuário que está convidando alguém
  invitedUserEmail: string;//Email do usuário que está sendo convidado
  invitedUserTenantIds: number[];
}