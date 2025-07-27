import { prisma } from "../database/prisma-client";
import {
  QuickResponse,
  QuickResponseRepository,
} from "../types/quickResponses-interface";

class QuickResponseRepositoryPrisma implements QuickResponseRepository {
  async create(data: QuickResponse): Promise<QuickResponse> {
    const quickResponse = await prisma.quickResponse.create({ data });
    return {
      id: quickResponse.id,
      title: quickResponse.title,
      shortcut: quickResponse.shortcut,
      createdAt: quickResponse.createdAt,
      updatedAt: quickResponse.updatedAt,
      queueId: quickResponse.queueId,
    };
  }

  //   async findById(id: string): Promise<QuickResponse | null> {
  //     // Implementação da busca de uma resposta rápida pelo ID usando Prisma
  //   }

  //   async findAll(): Promise<QuickResponse[]> {
  //     // Implementação da busca de todas as respostas rápidas usando Prisma
  //   }

  //   async update(
  //     id: string,
  //     data: Partial<QuickResponse>
  //   ): Promise<QuickResponse | null> {
  //     // Implementação da atualização de uma resposta rápida usando Prisma
  //   }

  //   async delete(id: string): Promise<boolean> {
  //     // Implementação da exclusão de uma resposta rápida usando Prisma
  //   }
}

export { QuickResponseRepositoryPrisma };
