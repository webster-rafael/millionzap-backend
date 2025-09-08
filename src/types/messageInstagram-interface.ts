import { Prisma } from "@prisma/client";

interface UserInfo {
  id: string;
  name: string;
}
interface ConversationInstagramInfo {
  id: string;
  name: string;
  username: string;
  image: string;
}

export interface MessageInstagram {
  id: string;
  conversationInstagramId: string;
  userId: string | null;
  content: string;
  messageType: string;
  plataform: string | null;
  direction: "INBOUND" | "OUTBOUND";
  timestamp: string;
  createdAt: Date;
  updatedAt: Date | null;
  companyId: string | null;
  user?: UserInfo | null;
  conversation?: ConversationInstagramInfo;
}

export type MessageInstagramCreate = Prisma.MessageInstagramCreateInput;
export type MessageInstagramUpdate = Prisma.MessageInstagramUpdateInput;

export interface MessageInstagramRepository {
  create(data: MessageInstagramCreate): Promise<MessageInstagram>;
  findAll(): Promise<MessageInstagram[]>;
  findById(id: string): Promise<MessageInstagram | null>;
  update(id: string, data: MessageInstagramUpdate): Promise<MessageInstagram>;
  delete(id: string): Promise<void>;
}
