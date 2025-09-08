import { prisma } from "../database/prisma-client";
import { Prisma } from "@prisma/client";
import {
  MessageInstagram,
  MessageInstagramRepository,
} from "../types/messageInstagram-interface";

export class MessageInstagramRepositoryPrisma
  implements MessageInstagramRepository
{
  async create(
    data: Prisma.MessageInstagramCreateInput
  ): Promise<MessageInstagram> {
    return await prisma.messageInstagram.create({ data });
  }

  async findAll(): Promise<MessageInstagram[]> {
    return await prisma.messageInstagram.findMany();
  }

  async findById(id: string): Promise<MessageInstagram | null> {
    return await prisma.messageInstagram.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Prisma.MessageInstagramUpdateInput
  ): Promise<MessageInstagram> {
    return await prisma.messageInstagram.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.messageInstagram.delete({ where: { id } });
  }
}
