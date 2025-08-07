import { prisma } from "../database/prisma-client";
import { CreateTags, Tags, TagsRepository } from "../types/tag-interface";

class TagsRepositoryPrisma implements TagsRepository {
  async create(tag: CreateTags, companyId: string): Promise<Tags> {
    const createdTag = await prisma.tags.create({
      data: { ...tag, companyId },
    });
    return this.toTags(createdTag);
  }

  async findAll(companyId: string): Promise<Tags[]> {
    const tags = await prisma.tags.findMany({
      where: {
        companyId: companyId,
      },
    });
    return tags.map(this.toTags);
  }

  async update(
    id: string,
    data: Partial<CreateTags>,
    companyId: string
  ): Promise<Tags> {
    const updatedTag = await prisma.tags.update({
      where: { id, companyId },
      data,
    });
    return this.toTags(updatedTag);
  }

  async findById(id: string, companyId: string): Promise<Tags | null> {
    const tag = await prisma.tags.findUnique({
      where: { id, companyId },
    });

    return tag ? this.toTags(tag) : null;
  }

  async delete(id: string, companyId: string): Promise<void> {
    await prisma.tags.delete({
      where: { id, companyId },
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
    companyId: tag.companyId,
  });
}

export { TagsRepositoryPrisma };
