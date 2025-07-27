export interface Conversation {
  id: string;
  contactId: string;
  userId: string;
  queueId: string;
  status: ConversationStatus;
  subject: string;
  lastMessageAt: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum ConversationStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  PENDING = "PENDING",
  WAITING = "WAITING",
  SERVING = "SERVING",
  RESOLVED = "RESOLVED",
}


