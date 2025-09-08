import { Prisma } from "@prisma/client";

export interface ConversationInstagram {
  id: string;
  name: string;
  username: string;
  image: string;
  userId?: string | null;
  queueId?: string | null;
  tagId?: string | null;
  companyId: string;
  createdAt: Date;
  updatedAt?: Date | null;
  user?: UserInfo | null;
  messages?: MessageInfo[];
}

export type ConversationInstagramCreate =
  Prisma.ConversationInstagramCreateInput;

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
  name: string;
  username: string;
  image: string;
  companyId: string;
  userId?: string | null;
  queueId?: string | null;
}

export interface ConversationInstagramRepository {
  create(
    conversation: NewConversationData,
    companyId: string
  ): Promise<ConversationInstagram>;
  findAll(companyId: string): Promise<ConversationInstagram[]>;
  findById(
    id: string,
    companyId: string
  ): Promise<ConversationInstagram | null>;
  update(
    id: string,
    conversation: Partial<ConversationInstagramCreate>
  ): Promise<ConversationInstagram>;
  findForKanban(companyId: string): Promise<ConversationInstagram[]>;
  delete(id: string, companyId: string): Promise<void>;
}
