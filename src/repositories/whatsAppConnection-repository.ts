import { prisma } from "../database/prisma-client";
import {
  CreateWhatsAppConnection,
  WhatsAppConnectionCreateInput,
  WhatsAppConnection,
  WhatsAppConnectionRepository,
} from "../types/whatsappConnection-interface";

class WhatsAppConnectionRepositoryPrisma
  implements WhatsAppConnectionRepository
{
  async create(
    connection: WhatsAppConnectionCreateInput
  ): Promise<WhatsAppConnection> {
    const createConnection = await prisma.whatsAppConnection.create({
      data: connection,
    });

    return this.toCreateConnection(createConnection);
  }

  async findAll(): Promise<WhatsAppConnection[]> {
    const connections = await prisma.whatsAppConnection.findMany();
    return connections.map(this.toCreateConnection);
  }

  async update(
    id: string,
    connection: Partial<CreateWhatsAppConnection>
  ): Promise<WhatsAppConnection> {
    const updateConnections = await prisma.whatsAppConnection.update({
      where: { id },
      data: connection,
    });

    return this.toCreateConnection(updateConnections);
  }

  async findById(id: string): Promise<WhatsAppConnection | null> {
    const connection = await prisma.whatsAppConnection.findUnique({
      where: { id },
    });

    return connection ? this.toCreateConnection(connection) : null;
  }

  async delete(id: string): Promise<void> {
    await prisma.whatsAppConnection.delete({
      where: { id },
    });
  }

  private toCreateConnection = (
    data: WhatsAppConnection
  ): WhatsAppConnection => ({
    id: data.id,
    name: data.name,
    isDefault: data.isDefault,
    greetingMessage: data.greetingMessage ?? "",
    conclusionMessage: data.conclusionMessage ?? "",
    outOfOfficeHoursMessage: data.outOfOfficeHoursMessage ?? "",
    reviewMessage: data.reviewMessage ?? "",
    token: data.token,
    queueId: data.queueId,
    promptId: data.promptId,
    transferQueueId: data.transferQueueId,
    timeToTransfer: data.timeToTransfer,
    expiresInactiveMessage: data.expiresInactiveMessage,
    qrCode: data.qrCode,
    session: data.session,
    status: data.status,
    companyId: data.companyId ?? "",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  });
}

export { WhatsAppConnectionRepositoryPrisma };
