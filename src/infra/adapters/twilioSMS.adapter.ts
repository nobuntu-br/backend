import twilio from "twilio";
import { ISMSParams, ISMSService } from "../../domain/services/Isms.service";

export class TwilioSMSAdapter implements ISMSService {
  private client: twilio.Twilio;

  constructor(accountSid: string, authToken: string, from: string) {
    this.client = twilio(accountSid, authToken);
  }

  async sendSMS({from, to, message}: ISMSParams): Promise<void> {
    try {
      await this.client.messages.create({
        body: message,
        from: from,
        to,
      });
    } catch (error) {
      throw new Error("Error to send SMS. Details:"+ error);
    }
  }
}