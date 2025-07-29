import { QuickResponseRepositoryPrisma } from "../repositories/quickresponse-repository";
import {
  QuickResponse,
  QuickResponseCreate,
  QuickResponseCreateInput,
  QuickResponseRepository,
} from "../types/quickResponses-interface";

class QuickResponseUseCase {
  private quickResponseRepository: QuickResponseRepository;
  constructor() {
    this.quickResponseRepository = new QuickResponseRepositoryPrisma();
  }

  async create(data: QuickResponseCreateInput): Promise<QuickResponse> {
    return this.quickResponseRepository.create(data);
  }

  async findAll(): Promise<QuickResponse[]> {
    return this.quickResponseRepository.findAll();
  }

  async findById(id: string): Promise<QuickResponse | null> {
    return this.quickResponseRepository.findById(id);
  }

  async update(data: QuickResponse): Promise<QuickResponse> {
    return this.quickResponseRepository.update(data);
  }

  async delete(id: string): Promise<QuickResponse> {
    return this.quickResponseRepository.delete(id);
  }
}

export { QuickResponseUseCase };
