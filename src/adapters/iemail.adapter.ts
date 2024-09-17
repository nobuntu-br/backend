export interface EmailAdapter {
  sendMail(to: string, subject: string, text: string): Promise<void>;
}