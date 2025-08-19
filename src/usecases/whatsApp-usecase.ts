import { WhatsAppConnectionRepositoryPrisma } from "../repositories/whatsAppConnection-repository";
import {
  WhatsAppConnectionCreateInput,
  WhatsAppConnection,
  WhatsAppConnectionRepository,
} from "../types/whatsAppConnection-interface";

class WhatsAppConnectionUseCase {
  private whatsAppConnectionRepository: WhatsAppConnectionRepository;
  constructor() {
    this.whatsAppConnectionRepository =
      new WhatsAppConnectionRepositoryPrisma();
  }

  async create(
    connection: WhatsAppConnectionCreateInput,
    companyId: string
  ): Promise<WhatsAppConnection> {
    return this.whatsAppConnectionRepository.create(connection, companyId);
  }

  async findAll(companyId: string): Promise<WhatsAppConnection[]> {
    return this.whatsAppConnectionRepository.findAll(companyId);
  }

  async findById(
    id: string,
    companyId: string
  ): Promise<WhatsAppConnection | null> {
    return this.whatsAppConnectionRepository.findById(id, companyId);
  }

  async update(
    id: string,
    connection: WhatsAppConnection,
    companyId: string
  ): Promise<WhatsAppConnection> {
    return this.whatsAppConnectionRepository.update(id, connection, companyId);
  }

  async delete(id: string, companyId: string): Promise<void> {
    return this.whatsAppConnectionRepository.delete(id, companyId);
  }
}

export { WhatsAppConnectionUseCase };
