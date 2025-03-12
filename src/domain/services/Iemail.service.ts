export interface IEmailParams {
  from?: string;  // O "from" é opcional
  to: string;
  subject: string;
  text: string;
}

export interface IEmailServerData {
  host: string, 
  port: number;
  emailServerUser: string;
  emailServerPassword: string;
}

export interface IEmailService {
  sendEmail({from, to, subject, text}: IEmailParams): Promise<void>;
}