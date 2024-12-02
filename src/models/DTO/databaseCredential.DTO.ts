import { DatabaseType } from "../../adapters/createDb.adapter";

export interface DatabaseCredentialInputDTO {
  name?: string;
  type: DatabaseType;
  username?: string;
  password?: string;
  host?: string;
  port?: string;
  srvEnabled: boolean; // Indica se usa protocolo SRV (mongodb)
  options?: string;
  storagePath?: string;
  sslEnabled: boolean;
  poolSize?: number;
  timeOutTime?: number;

  //SSL data
  sslCertificateAuthority?: string; //Serve para verificar que o certificado apresentado pelo servidor ou cliente é confiável e foi emitido por uma CA válida.
  sslPrivateKey?: string; //Usada para descriptografar mensagens recebidas e assinar mensagens enviadas. Deve ser mantido em segredo.
  sslCertificate?: string; //Informações públicas, como o domínio, entidade responsável e a CertificateAuthority que o emitiu.

  tenantId?: string;
  userUID?: string;
}