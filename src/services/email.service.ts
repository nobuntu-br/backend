
export class EmailService {
  
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'seu_email@gmail.com',
      pass: 'sua_senha_do_email',
    },
  });

  async enviarEmail(destinatario: string, assunto: string, corpo: string) {
    try {
      await this.transporter.sendMail({
        from: 'seu_email@gmail.com',
        to: destinatario,
        subject: assunto,
        html: corpo,
      });
      console.log('Email enviado com sucesso');
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new Error('Erro ao enviar email');
    }
  }
}
