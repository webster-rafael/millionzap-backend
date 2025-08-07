import { prisma } from "../database/prisma-client";
import {
  Conversation,
  ConversationCreate,
  ConversationRepository,
} from "../types/conversation-interface";

class ConversationRepositoryPrisma implements ConversationRepository {
  async findAll(): Promise<Conversation[]> {
    const conversations = await prisma.conversation.findMany({
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

  async findById(id: string): Promise<Conversation | null> {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });
    return conversation ? this.toConversation(conversation) : null;
  }

  async update(
    id: string,
    conversation: Partial<ConversationCreate>
  ): Promise<Conversation> {
    const updatedConversation = await prisma.conversation.update({
      where: { id },
      data: conversation,
    });

    return this.toConversation(updatedConversation);
  }

  async findForKanban(): Promise<Conversation[]> {
    const conversationsWithIncludes = await prisma.conversation.findMany({
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

  private toConversation = (conversation: Conversation): Conversation => ({
    id: conversation.id,
    contactId: conversation.contactId,
    userId: conversation.userId ?? "",
    queueId: conversation.queueId ?? "",
    status: conversation.status,
    priority: conversation.priority ?? null,
    subject: conversation.subject ?? "",
    lastMessageAt: conversation.lastMessageAt ?? null,
    closedAt: conversation.closedAt ?? null,
    createdAt: conversation.createdAt,
    companyId: conversation.companyId,
    updatedAt: conversation.updatedAt ?? null,
  });
}
export { ConversationRepositoryPrisma };
