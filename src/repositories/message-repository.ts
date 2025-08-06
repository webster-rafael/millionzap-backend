import { prisma } from "../database/prisma-client";
import { Prisma } from "../generated/prisma-client";
import {
  Message,
  MessageCreate,
  MessageRepository,
} from "../types/message-interface";

export class MessageRepositoryPrisma implements MessageRepository {
  async create(data: Prisma.MessageCreateInput): Promise<Message> {
    return await prisma.message.create({ data });
  }

  async findAll(): Promise<Message[]> {
    return await prisma.message.findMany();
  }

  async findById(id: string): Promise<Message | null> {
    return await prisma.message.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.MessageUpdateInput): Promise<Message> {
    return await prisma.message.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.message.delete({ where: { id } });
  }
}
