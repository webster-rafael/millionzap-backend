import { WhatsAppConnectionStatus } from "../generated/prisma-client";

export interface WhatsAppConnection {
  id: string;
  name: string;
  isDefault: boolean;
  greetingMessage?: string | null;
  conclusionMessage?: string | null;
  outOfOfficeHoursMessage?: string | null;
  reviewMessage?: string | null;
  token?: string | null;
  queueId: string;
  integrationId?: string | null;
  userId?: string | null;
  promptId: string;
  transferQueueId?: string | null;
  timeToTransfer?: string | null;
  expiresInactiveMessage?: string | null;
  companyId?: string | null;
  session: string;
  qrCode: string;
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
  queueId: string;
  companyId?: string | null;
  promptId: string;
  transferQueueId?: string | null;
  timeToTransfer?: string | null;
  expiresInactiveMessage?: string | null;
  session: string;
  qrCode: string;
  status: WhatsAppConnectionStatus;
}

export type WhatsAppConnectionCreateInput = Omit<
  WhatsAppConnection,
  "id" | "createdAt" | "updatedAt"
>;

export interface WhatsAppConnectionRepository {
  create(
    connection: WhatsAppConnectionCreateInput
  ): Promise<WhatsAppConnection>;
  findAll(): Promise<WhatsAppConnection[]>;
  update(
    id: string,
    connection: Partial<WhatsAppConnection>
  ): Promise<WhatsAppConnection>;
  findById(id: string): Promise<WhatsAppConnection | null>;
  delete(id: string): Promise<void>;
}
