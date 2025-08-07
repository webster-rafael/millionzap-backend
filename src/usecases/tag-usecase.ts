import { TagsRepositoryPrisma } from "../repositories/tags-repository";
import { CreateTags, Tags, TagsRepository } from "../types/tag-interface";

class TagUseCase {
  private tagRepository: TagsRepository;
  constructor() {
    this.tagRepository = new TagsRepositoryPrisma();
  }

  async create(tag: CreateTags, companyId: string): Promise<Tags> {
    return this.tagRepository.create(tag, companyId);
  }

  async findAll(companyId: string): Promise<Tags[]> {
    return this.tagRepository.findAll(companyId);
  }

  async update(
    id: string,
    tag: Partial<CreateTags>,
    companyId: string
  ): Promise<Tags> {
    return this.tagRepository.update(id, tag, companyId);
  }

  async findById(id: string, companyId: string): Promise<Tags | null> {
    return this.tagRepository.findById(id, companyId);
  }

  async delete(id: string, companyId: string): Promise<void> {
    return this.tagRepository.delete(id, companyId);
  }
}

export { TagUseCase };
