import { PromptRepositoryPrisma } from "../repositories/prompt-repository";
import {
  Prompt,
  PromptCreateInput,
  PromptRepository,
} from "../types/prompt-interface";

class PromptUseCase {
  private promptRepository: PromptRepository;
  constructor() {
    this.promptRepository = new PromptRepositoryPrisma();
  }
  async create(prompt: PromptCreateInput, companyId: string): Promise<Prompt> {
    return this.promptRepository.create(prompt, companyId);
  }

  async findAll(companyId: string): Promise<Prompt[]> {
    return this.promptRepository.findAll(companyId);
  }
  async findById(id: string, companyId: string): Promise<Prompt | null> {
    return this.promptRepository.findById(id, companyId);
  }

  async update(prompt: Prompt, companyId: string): Promise<Prompt> {
    return this.promptRepository.update(prompt, companyId);
  }

  async delete(id: string, companyId: string): Promise<void> {
    return this.promptRepository.delete(id, companyId);
  }
}
export { PromptUseCase };
