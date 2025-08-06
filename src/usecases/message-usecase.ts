import {
  Direction,
  Message,
  MessageStatus,
  Prisma,
} from "../generated/prisma-client";
import { MessageRepositoryPrisma } from "../repositories/message-repository";
import { MessageRepository } from "../types/message-interface";

export class MessageUseCase {
  private messageRepository: MessageRepository;

  constructor() {
    this.messageRepository = new MessageRepositoryPrisma();
  }

  async create(data: Prisma.MessageCreateInput): Promise<Message> {
    return this.messageRepository.create(data);
  }

  async findAll(): Promise<Message[]> {
    return this.messageRepository.findAll();
  }

  async findById(id: string): Promise<Message | null> {
    return this.messageRepository.findById(id);
  }

  async update(id: string, data: Prisma.MessageUpdateInput): Promise<Message> {
    return this.messageRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.messageRepository.delete(id);
  }
}
