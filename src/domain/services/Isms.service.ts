export interface ISMSParams {
  from: string;
  to: string;
  message: string;
}

export interface ISMSService {
  sendSMS({from, to, message}: ISMSParams): Promise<void>;
}