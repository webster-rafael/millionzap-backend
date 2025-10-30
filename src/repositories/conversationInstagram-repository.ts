import { prisma } from "../database/prisma-client";
import {
  ConversationInstagram,
  ConversationInstagramRepository,
  NewConversationData,
  ConversationInstagramCreate,
} from "../types/conversationInstagram-interface";

class ConversationInstagramRepositoryPrisma
  implements ConversationInstagramRepository
{
  async create(
    conversation: NewConversationData,
    companyId: string
  ): Promise<ConversationInstagram> {
    const newConversation = await prisma.conversationInstagram.create({
      data: {
        ...conversation,
        companyId,
      },
    });
    return newConversation;
  }

  async findAll(companyId: string): Promise<ConversationInstagram[]> {
    const conversations = await prisma.conversationInstagram.findMany({
      where: { companyId },
      include: {
        user: true,
        queue: true,
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            content: true,
            direction: true,
            timestamp: true,
            messageType: true,
            createdAt: true,
            thumbnailUrl: true,
            permalink: true,
          },
        },
      },
    });

    const sorted = conversations.sort((a, b) => {
      const lastMessageA =
        a.messages.length > 0 ? a.messages[a.messages.length - 1] : null;
      const lastMessageB =
        b.messages.length > 0 ? b.messages[b.messages.length - 1] : null;
      const timestampA = lastMessageA ? Number(lastMessageA.timestamp) : 0;
      const timestampB = lastMessageB ? Number(lastMessageB.timestamp) : 0;
      return timestampB - timestampA;
    });

    return sorted as ConversationInstagram[];
  }

  async findById(
    id: string,
    companyId: string
  ): Promise<ConversationInstagram | null> {
    const conversation = await prisma.conversationInstagram.findUnique({
      where: { id, companyId },
      include: {
        user: true,
        queue: true,
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            content: true,
            direction: true,
            timestamp: true,
            messageType: true,
            createdAt: true,
            thumbnailUrl: true,
            permalink: true,
          },
        },
      },
    });
    return conversation;
  }

  async update(
    id: string,
    conversation: Partial<ConversationInstagramCreate>
  ): Promise<ConversationInstagram> {
    const updatedConversation = await prisma.conversationInstagram.update({
      where: { id },
      data: conversation,
      include: {
        user: true,
        queue: true,
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            content: true,
            direction: true,
            timestamp: true,
            messageType: true,
            createdAt: true,
            thumbnailUrl: true,
            permalink: true,
          },
        },
      },
    });

    return updatedConversation;
  }

  async findForKanban(companyId: string): Promise<ConversationInstagram[]> {
    const conversationsWithIncludes =
      await prisma.conversationInstagram.findMany({
        where: { companyId },
        include: {
          user: true,
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              id: true,
              content: true,
              direction: true,
              timestamp: true,
              messageType: true,
              createdAt: true,
              thumbnailUrl: true,
              permalink: true,
            },
          },
        },
      });

    const sorted = conversationsWithIncludes.sort((a, b) => {
      const dateA = a.messages[0]?.createdAt
        ? new Date(a.messages[0].createdAt).getTime()
        : 0;
      const dateB = b.messages[0]?.createdAt
        ? new Date(b.messages[0].createdAt).getTime()
        : 0;
      return dateB - dateA;
    });

    return sorted as ConversationInstagram[];
  }

  async delete(id: string, companyId: string): Promise<void> {
    await prisma.conversationInstagram.delete({
      where: {
        id,
        companyId,
      },
    });
  }
}

export { ConversationInstagramRepositoryPrisma };
