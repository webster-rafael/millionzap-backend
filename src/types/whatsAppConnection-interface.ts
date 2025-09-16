import { WhatsAppConnectionStatus } from "@prisma/client";

export interface WhatsAppConnection {
  id: string;
  name: string;
  isDefault: boolean;
  greetingMessage?: string | null;
  conclusionMessage?: string | null;
  outOfOfficeHoursMessage?: string | null;
  reviewMessage?: string | null;
  token?: string | null;
  queueId?: string | null;
  integrationId?: string | null;
  userId?: string | null;
  promptId: string | null;
  transferQueueId?: string | null;
  timeToTransfer?: string | null;
  expiresInactiveMessage?: string | null;
  companyId: string;
  session: string;
  instanceName?: string | null;
  instanceId?: string | null;
  status: WhatsAppConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWhatsAppConnection {
  name: string;
  isDefault: boolean;
  greetingMessage?: string | null;
  conclusionMessage?: string | null;
  outOfOfficeHoursMessage?: string | null;
  reviewMessage?: string | null;
  token?: string | null;
  queueId?: string | null;
  companyId: string;
  promptId: string | null;
  transferQueueId?: string | null;
  timeToTransfer?: string | null;
  expiresInactiveMessage?: string | null;
  session: string;
  instanceName?: string | null;
  instanceId?: string | null;
  status: WhatsAppConnectionStatus;
}

export type WhatsAppConnectionCreateInput = Omit<
  WhatsAppConnection,
  "id" | "createdAt" | "updatedAt"
>;

export interface WhatsAppConnectionRepository {
  create(
    connection: WhatsAppConnectionCreateInput,
    companyId: string
  ): Promise<WhatsAppConnection>;
  findAll(companyId: string): Promise<WhatsAppConnection[]>;
  update(
    id: string,
    connection: Partial<WhatsAppConnection>,
    companyId: string
  ): Promise<WhatsAppConnection>;
  findById(id: string, companyId: string): Promise<WhatsAppConnection | null>;
  delete(id: string, companyId: string): Promise<void>;
}
