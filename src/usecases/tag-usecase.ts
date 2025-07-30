import { TagsRepositoryPrisma } from "../repositories/tags-repository";
import { CreateTags, Tags, TagsRepository } from "../types/tag-interface";

class TagUseCase {
  private tagRepository: TagsRepository;
  constructor() {
    this.tagRepository = new TagsRepositoryPrisma();
  }

  async create(tag: CreateTags): Promise<Tags> {
    return this.tagRepository.create(tag);
  }

  async findAll(): Promise<Tags[]> {
    return this.tagRepository.findAll();
  }

  async update(id: string, tag: CreateTags): Promise<Tags> {
    return this.tagRepository.update(id, tag);
  }

  async findById(id: string): Promise<Tags | null> {
    return this.tagRepository.findById(id);
  }

  async delete(id: string): Promise<void> {
    return this.tagRepository.delete(id);
  }
}

export { TagUseCase };
