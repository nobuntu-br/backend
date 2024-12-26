export interface DatabasePermissionDTO {
  user?: number;
  tenant: number;
  databaseCredential: number;
  userUID: string;
  isAdmin?: boolean;
}
 
export interface DatabasePermissionDetailOutputDTO {
  tenant: {
    id: number,
    name: string
  };
  databaseCredential: {
    id: number,

  };
  userUID: string;
  isAdmin?: boolean;
}