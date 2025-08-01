import { prisma } from "../database/prisma-client";
import { CreateTags, Tags, TagsRepository } from "../types/tag-interface";

class TagsRepositoryPrisma implements TagsRepository {
  async create(tag: CreateTags): Promise<Tags> {
    const createdTag = await prisma.tags.create({ data: tag });
    return this.toTags(createdTag);
  }

  async findAll(): Promise<Tags[]> {
    const tags = await prisma.tags.findMany();
    return tags.map(this.toTags);
  }

  async update(id: string, data: Partial<CreateTags>): Promise<Tags> {
    const updatedTag = await prisma.tags.update({
      where: { id },
      data,
    });
    return this.toTags(updatedTag);
  }

  async findById(id: string): Promise<Tags | null> {
    const tag = await prisma.tags.findUnique({
      where: { id },
    });

    return tag ? this.toTags(tag) : null;
  }

  async delete(id: string): Promise<void> {
    await prisma.tags.delete({
      where: { id },
    });
  }

  private toTags = (tag: Tags): Tags => ({
    id: tag.id,
    title: tag.title,
    color: tag.color,
    order: tag.order,
    description: tag.description ?? "",
    createdAt: tag.createdAt,
    updatedAt: tag.updatedAt,
  });
}

export { TagsRepositoryPrisma };
