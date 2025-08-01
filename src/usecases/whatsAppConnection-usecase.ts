import { WhatsAppConnectionRepositoryPrisma } from "../repositories/whatsAppConnection-repository";
import {
  WhatsAppConnectionCreateInput,
  WhatsAppConnection,
  WhatsAppConnectionRepository,
} from "../types/whatsappConnection-interface";

class WhatsAppConnectionUseCase {
  private whatsAppConnectionRepository: WhatsAppConnectionRepository;
  constructor() {
    this.whatsAppConnectionRepository =
      new WhatsAppConnectionRepositoryPrisma();
  }

  async create(
    connection: WhatsAppConnectionCreateInput
  ): Promise<WhatsAppConnection> {
    return this.whatsAppConnectionRepository.create(connection);
  }

  async findAll(): Promise<WhatsAppConnection[]> {
    return this.whatsAppConnectionRepository.findAll();
  }

  async findById(id: string): Promise<WhatsAppConnection | null> {
    return this.whatsAppConnectionRepository.findById(id);
  }

  async update(
    id: string,
    connection: WhatsAppConnection
  ): Promise<WhatsAppConnection> {
    return this.whatsAppConnectionRepository.update(id, connection);
  }

  async delete(id: string): Promise<void> {
    return this.whatsAppConnectionRepository.delete(id);
  }
}

export { WhatsAppConnectionUseCase };
