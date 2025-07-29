import { prisma } from "../database/prisma-client";
import {
  QuickResponse,
  QuickResponseCreateInput,
  QuickResponseRepository,
} from "../types/quickResponses-interface";

class QuickResponseRepositoryPrisma implements QuickResponseRepository {
  async create(data: QuickResponseCreateInput): Promise<QuickResponse> {
    const quickResponse = await prisma.quickResponse.create({ data });
    return quickResponse;
  }

  async findAll(): Promise<QuickResponse[]> {
    const quickResponses = await prisma.quickResponse.findMany();
    return quickResponses;
  }

  async findById(id: string): Promise<QuickResponse | null> {
    const quickResponse = await prisma.quickResponse.findUnique({
      where: { id },
    });
    return quickResponse;
  }

  async update(data: QuickResponse): Promise<QuickResponse> {
    const updatedQuickResponse = await prisma.quickResponse.update({
      where: { id: data.id },
      data,
    });
    return updatedQuickResponse;
  }

  async delete(id: string): Promise<QuickResponse> {
    const deletedQuickResponse = await prisma.quickResponse.delete({
      where: { id },
    });
    return deletedQuickResponse;
  }
}

export { QuickResponseRepositoryPrisma };
