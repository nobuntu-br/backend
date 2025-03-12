import nodemailer, { Transporter } from 'nodemailer';
import { IEmailParams, IEmailServerData, IEmailService } from '../../domain/services/Iemail.service';

/**
 * Implementação das funcionalidades de envio de e-mail com uso da biblioteca NodeMailer
 */
export class NodemailerAdapter implements IEmailService {
  private transporter: Transporter;

  constructor(emailServerData: IEmailServerData) {
    this.transporter = this.createTransport(emailServerData);
  }

  createTransport(emailServerData: IEmailServerData): Transporter {
    try {
      return nodemailer.createTransport({
        host: emailServerData.host,
        port: emailServerData.port,
        secure: false,
        auth: {
          user: emailServerData.emailServerUser,
          pass: emailServerData.emailServerPassword,
        },
      });
    } catch (error) {
      throw new Error("Error to create Transporter to send Emails. Details:"+ error);
    }
  }

  async sendEmail({ from, to, subject, text }: IEmailParams): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: from,
        to,
        subject,
        text,
      });  
    } catch (error) {
      throw new Error("Error to send Email. Details:"+ error);
    }
    
  }
  
}