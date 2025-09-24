import { Prisma } from "@prisma/client";

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
  companyId: string;
  copilot?: boolean | null;
  statusCopilot?: string | null;
  copilotIndex?: number | null;
  copilotFeedback?: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt?: Date | null;

  contact?: ContactInfo | null;
  user?: UserInfo | null;
  messages?: MessageInfo[];
}

export type ConversationCreate = Prisma.ConversationCreateInput;

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

export interface NewConversationData {
  contactId: string;
  companyId: string;
  userId?: string | null;
  queueId?: string | null;
}

export interface ConversationRepository {
  create(
    conversation: NewConversationData,
    companyId: string
  ): Promise<Conversation>;
  findAll(companyId: string): Promise<Conversation[]>;
  findById(id: string, companyId: string): Promise<Conversation | null>;
  update(
    id: string,
    conversation: Partial<ConversationCreate>
  ): Promise<Conversation>;
  findForKanban(companyId: string): Promise<Conversation[]>;
  delete(id: string, companyId: string): Promise<void>;
}
