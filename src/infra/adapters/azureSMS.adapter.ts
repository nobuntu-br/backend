import { ISMSParams, ISMSService } from "../../domain/services/Isms.service";
import { SmsClient } from "@azure/communication-sms";

export class AzureSMSAdapter implements ISMSService {
  private client: SmsClient;

  constructor(connectionString: string) {
    //`endpoint=https://<resource-name>.communication.azure.com/;accessKey=<Base64-Encoded-Key>` <- exemplo de connection string
    this.client = new SmsClient(connectionString);
  }

  async sendSMS({from, to, message}: ISMSParams): Promise<void> {
    try {
      const sendResults = await this.client.send({
        from: from, // Your E.164 formatted phone number used to send SMS
        to: [to], // The list of E.164 formatted phone numbers to which message is being sent
        message: message, // The message being sent
      });
    } catch (error) {
      throw new Error("Error to send SMS. Details:"+ error);
    }
  }
}