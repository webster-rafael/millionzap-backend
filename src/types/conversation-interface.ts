import { Prisma } from "../generated/prisma-client";

export interface Conversation {
  id: string;
  contactId: string;
  userId?: string | null;
  queueId?: string | null;
  tagId?: string | null;
  status: string;
  priority?: string | null;
  subject?: string | null;
  lastMessageAt?: Date | null;
  closedAt?: Date | null;
  createdAt: Date;
  updatedAt?: Date | null;

  contact?: ContactInfo | null;
  user?: UserInfo | null;
  messages?: MessageInfo[];
}

export type ConversationCreate = Prisma.ConversationCreateInput;
type ConversationUpdate = Prisma.ConversationUpdateInput;

interface ContactInfo {
  id: string;
  name: string;
  phone: string;
}

interface UserInfo {
  id: string;
  name: string;
}

interface MessageInfo {
  id: string;
  content: string;
  createdAt: Date;
}

export interface ConversationRepository {
  findAll(): Promise<Conversation[]>;
  findById(id: string): Promise<Conversation | null>;
  update(
    id: string,
    conversation: Partial<ConversationCreate>
  ): Promise<Conversation>;
  findForKanban(): Promise<Conversation[]>;
}
