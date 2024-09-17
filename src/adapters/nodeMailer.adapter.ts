import nodemailer, { Transporter } from 'nodemailer';
import { EmailAdapter } from './iemail.adapter';
import { NotFoundError } from '../errors/notFound.error';

export class NodemailerAdapter implements EmailAdapter {
  private transporter: Transporter;

  constructor(){
    const emailServerHost: string | undefined = process.env.EMAIL_SERVER_HOST;
    const emailServerPort: string | undefined = process.env.EMAIL_SERVER_PORT;
    const emailServerUser: string | undefined = process.env.EMAIL_SERVER_USER;
    const emailServerPassword: string | undefined = process.env.EMAIL_SERVER_PASSWORD;

    if (emailServerHost == undefined ||
      emailServerPort == undefined ||
      emailServerUser == undefined ||
      emailServerPassword == undefined
    ) {
      throw new NotFoundError("Não foi encontrado as credenciais para acessar o servidor de email.")
    }

    const port = parseInt(emailServerPort);//TODO pode dar erro.

    this.transporter = nodemailer.createTransport({
      host: emailServerHost,
      port: port,
      secure: false,
      auth: {
        user: emailServerUser,
        pass: emailServerPassword,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  }
}
