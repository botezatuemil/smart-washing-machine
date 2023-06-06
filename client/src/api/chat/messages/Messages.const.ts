import moment from "moment";

export type RequestMessage = {
  conversationId: number;
  token: string;
};

export type Message = {
  id: number;
  conversationId: number;
  message: string;
  senderId: number;
  timestamp: moment.Moment;
};
