import { Message } from "@/model/User.model";

export interface APIresponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
