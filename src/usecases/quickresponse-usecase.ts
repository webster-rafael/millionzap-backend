import { QuickResponseRepositoryPrisma } from "../repositories/quickresponse-repository";
import {
  QuickResponse,
  QuickResponseCreate,
  QuickResponseRepository,
} from "../types/quickResponses-interface";

class QuickResponseUseCase {
  private quickResponseRepository: QuickResponseRepository;
  constructor() {
    this.quickResponseRepository = new QuickResponseRepositoryPrisma();
  }

  async create(data: QuickResponseCreate): Promise<QuickResponse> {
    return this.quickResponseRepository.create(data);
  }

  // async findById(id: string): Promise<QuickResponse | null> {
  //   return this.quickResponseRepository.findById(id);
  // }

  // async findAll(): Promise<QuickResponse[]> {
  //   return this.quickResponseRepository.findAll();
  // }

  // async update(
  //   id: string,
  //   data: Partial<QuickResponse>
  // ): Promise<QuickResponse | null> {
  //   return this.quickResponseRepository.update(id, data);
  // }

  // async delete(id: string): Promise<boolean> {
  //   return this.quickResponseRepository.delete(id);
  // }
}

export { QuickResponseUseCase };
