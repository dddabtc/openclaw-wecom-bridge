export interface WeComIncomingMessage {
  ToUserName: string;
  FromUserName: string;
  CreateTime: string;
  MsgType: string;
  Content?: string;
  MsgId?: string;
  AgentID?: string;
  ChatId?: string;
}

export interface OpenClawSendRequest {
  sessionId: string;
  text: string;
  metadata?: Record<string, string>;
}

export interface OpenClawSendResponse {
  message?: string;
  output?: string;
  ok?: boolean;
}
