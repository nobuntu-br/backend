export interface DatabasePermissionDTO {
  userId?: string;
  tenantId: string;
  databaseCredentialId: string;
  userUID: string;
  isAdmin?: boolean;
}
 
export interface DatabasePermissionDetailOutputDTO {
  tenant: {
    id: string,
    name: string
  };
  databaseCredential: {
    id: string,

  };
  userUID: string;
  isAdmin?: boolean;
}