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
  async create(prompt: PromptCreateInput): Promise<Prompt> {
    return this.promptRepository.create(prompt);
  }

  async findAll(): Promise<Prompt[]> {
    return this.promptRepository.findAll();
  }
  async findById(id: string): Promise<Prompt | null> {
    return this.promptRepository.findById(id);
  }

  async update(prompt: Prompt): Promise<Prompt> {
    return this.promptRepository.update(prompt);
  }

  async delete(id: string): Promise<void> {
    return this.promptRepository.delete(id);
  }
}
export { PromptUseCase };
