import { Prisma } from "../generated/prisma-client";

interface UserInfo {
  id: string;
  name: string;
}
interface ConversationInfo {
  id: string;
  status: string;
}

export interface Message {
  id: string;
  conversationId: string;
  userId: string | null;
  content: string;
  messageType: string;
  direction: "INBOUND" | "OUTBOUND";
  status: "PENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED" | "RECEIVED";
  mediaUrl: string | null;
  timestamp: string;
  mediaType: string | null;
  isRead: boolean;
  createdAt: Date;

  // Relacionamentos (opcionais)
  user?: UserInfo | null;
  conversation?: ConversationInfo;
}

export type MessageCreate = Prisma.MessageCreateInput;
export type MessageUpdate = Prisma.MessageUpdateInput;

export interface MessageRepository {
  create(data: MessageCreate): Promise<Message>;
  findAll(): Promise<Message[]>;
  findById(id: string): Promise<Message | null>;
  update(id: string, data: MessageUpdate): Promise<Message>;
  delete(id: string): Promise<void>;
}
