import { MessageInstagram, Prisma } from "@prisma/client";
import { MessageRepositoryPrisma } from "../repositories/message-repository";
import { MessageInstagramRepository } from "../types/messageInstagram-interface";
import { MessageInstagramRepositoryPrisma } from "../repositories/messageInstagram-repository";

export class MessageInstagramUseCase {
  private messageInstagramRepository: MessageInstagramRepository;

  constructor() {
    this.messageInstagramRepository = new MessageInstagramRepositoryPrisma();
  }

  async create(
    data: Prisma.MessageInstagramCreateInput
  ): Promise<MessageInstagram> {
    return this.messageInstagramRepository.create(data);
  }

  async findAll(): Promise<MessageInstagram[]> {
    return this.messageInstagramRepository.findAll();
  }

  async findById(id: string): Promise<MessageInstagram | null> {
    return this.messageInstagramRepository.findById(id);
  }

  async update(
    id: string,
    data: Prisma.MessageUpdateInput
  ): Promise<MessageInstagram> {
    return this.messageInstagramRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.messageInstagramRepository.delete(id);
  }
}
