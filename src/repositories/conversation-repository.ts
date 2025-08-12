import { prisma } from "../database/prisma-client";
import {
  Conversation,
  ConversationCreate,
  ConversationRepository,
  NewConversationData,
} from "../types/conversation-interface";

class ConversationRepositoryPrisma implements ConversationRepository {
  async create(
    conversation: NewConversationData,
    companyId: string
  ): Promise<Conversation> {
    const newConversation = await prisma.conversation.create({
      data: {
        ...conversation,
        companyId,
      },
    });
    return newConversation;
  }

  async findAll(companyId: string): Promise<Conversation[]> {
    const conversations = await prisma.conversation.findMany({
      where: { companyId },
      include: {
        contact: true,
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        user: true,
        queue: true,
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

    return sorted as Conversation[];
  }

  async findById(id: string, companyId: string): Promise<Conversation | null> {
    const conversation = await prisma.conversation.findUnique({
      where: { id, companyId },
      include: {
        contact: true,
        messages: { orderBy: { createdAt: "asc" } },
        user: true,
        queue: true,
      },
    });
    return conversation;
  }

  async update(
    id: string,
    conversation: Partial<ConversationCreate>
  ): Promise<Conversation> {
    const updatedConversation = await prisma.conversation.update({
      where: { id },
      data: conversation,
      include: {
        contact: true,
        messages: { orderBy: { createdAt: "asc" } },
        user: true,
        queue: true,
      },
    });

    return updatedConversation;
  }

  async findForKanban(companyId: string): Promise<Conversation[]> {
    const conversationsWithIncludes = await prisma.conversation.findMany({
      where: { companyId },
      include: {
        contact: true,
        user: true,
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
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

    return sorted as Conversation[];
  }

  async delete(id: string, companyId: string): Promise<void> {
    await prisma.conversation.delete({
      where: {
        id,
        companyId,
      },
    });
  }
}
export { ConversationRepositoryPrisma };
