import { EmailAdapter } from "../adapters/iemail.adapter";

export class EmailService {
  private emailAdapter: EmailAdapter;

  constructor(emailAdapter: EmailAdapter) {
    this.emailAdapter = emailAdapter;
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    await this.emailAdapter.sendMail(to, subject, text);
  }
}
