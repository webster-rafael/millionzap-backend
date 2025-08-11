import { FastifyInstance } from "fastify";
import { ConversationUseCase } from "../usecases/conversation-usecase";
import { ConversationCreate } from "../types/conversation-interface";
import { ConversationRepositoryPrisma } from "../repositories/conversation-repository";

export async function conversationRoutes(fastify: FastifyInstance) {
  const conversationRepository = new ConversationRepositoryPrisma();
  const conversationUseCase = new ConversationUseCase(conversationRepository);

  fastify.get("/kanban", async (request, reply) => {
    try {
      const loggedUser = request.user;

      console.log("loggedUser object:", JSON.stringify(loggedUser, null, 2));

      if (!loggedUser) {
        return reply.status(401).send({
          message: "Usuário não autenticado.",
        });
      }

      if (!loggedUser.companyId) {
        return reply.status(401).send({
          message: "Informações de empresa ausentes no token.",
        });
      }

      const kanbanConversations = await conversationUseCase.findForKanban(
        loggedUser.companyId
      );

      reply.status(200).send(kanbanConversations);
    } catch (error) {
      console.error("Erro ao buscar conversas para o Kanban:", error);
      reply
        .status(500)
        .send({ error: "Erro ao buscar conversas para o Kanban" });
    }
  });

  fastify.get("/", async (request, reply) => {
    try {
      const loggedUser = request.user;
      if (!loggedUser?.companyId) {
        return reply.status(401).send({
          message: "Informações de usuário ou empresa ausentes no token.",
        });
      }

      const conversations = await conversationUseCase.findAll(
        loggedUser.companyId
      );
      reply.status(200).send(conversations);
    } catch (error) {
      console.error("Erro ao buscar conversas:", error);
      reply.status(500).send({ error: "Erro ao buscar conversas" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const loggedUser = request.user;
      if (!loggedUser?.companyId) {
        return reply.status(401).send({
          message: "Informações de usuário ou empresa ausentes no token.",
        });
      }

      const conversation = await conversationUseCase.findById(
        request.params.id,
        loggedUser.companyId
      );
      if (!conversation) {
        return reply.status(404).send({ error: "Conversa não encontrada" });
      }
      reply.status(200).send(conversation);
    } catch (error) {
      console.error("Erro ao buscar conversa:", error);
      reply.status(500).send({ error: "Erro interno ao buscar conversa." });
    }
  });

  fastify.put<{ Params: { id: string }; Body: ConversationCreate }>(
    "/:id",
    async (request, reply) => {
      try {
        const loggedUser = request.user;
        if (!loggedUser?.companyId) {
          return reply.status(401).send({
            message: "Informações de usuário ou empresa ausentes no token.",
          });
        }

        const existing = await conversationUseCase.findById(
          request.params.id,
          loggedUser.companyId
        );
        if (!existing) {
          return reply.status(404).send({ error: "Conversa não encontrada" });
        }

        const updated = await conversationUseCase.update(
          request.params.id,
          request.body
        );

        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar conversa:", error);
        reply.status(500).send({ error: "Erro interno ao atualizar conversa" });
      }
    }
  );
}
