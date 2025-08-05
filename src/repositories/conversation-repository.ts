import { prisma } from "../database/prisma-client";
import {
  Conversation,
  ConversationCreate,
  ConversationRepository,
} from "../types/conversation-interface";

class ConversationRepositoryPrisma implements ConversationRepository {
  async findAll(): Promise<Conversation[]> {
    const conversations = await prisma.conversation.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return conversations.map(this.toConversation);
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

    // Ordena no JS pela data da última mensagem
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
    updatedAt: conversation.updatedAt ?? null,
  });
}
export { ConversationRepositoryPrisma };
