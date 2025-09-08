import { FastifyInstance } from "fastify";
import { ConversationInstagramRepositoryPrisma } from "../repositories/conversationInstagram-repository";
import { ConversationInstagramUseCase } from "../usecases/conversationInstagram-usecase";
import {
  NewConversationData,
  ConversationInstagramCreate,
} from "../types/conversationInstagram-interface";

export async function conversationInstagramRoutes(fastify: FastifyInstance) {
  const conversationInstagramRepository =
    new ConversationInstagramRepositoryPrisma();
  const conversationInstagramUseCase = new ConversationInstagramUseCase(
    conversationInstagramRepository
  );

  fastify.post<{ Body: NewConversationData }>("/", async (request, reply) => {
    try {
      const loggedUser = request.user;
      if (!loggedUser?.companyId) {
        return reply.status(401).send({
          message: "Informações de usuário ou empresa ausentes no token.",
        });
      }

      const conversationData = request.body;

      const newConversation = await conversationInstagramUseCase.create(
        conversationData,
        loggedUser.companyId
      );

      reply.status(201).send(newConversation);
    } catch (error) {
      console.error("Erro ao criar conversa Instagram:", error);
      reply.status(500).send({ error: "Erro interno ao criar conversa" });
    }
  });

  fastify.get("/kanban", async (request, reply) => {
    try {
      const loggedUser = request.user;
      if (!loggedUser?.companyId) {
        return reply.status(401).send({
          message: "Informações de empresa ausentes no token.",
        });
      }

      const kanbanConversations =
        await conversationInstagramUseCase.findForKanban(loggedUser.companyId);

      reply.status(200).send(kanbanConversations);
    } catch (error) {
      console.error("Erro ao buscar conversas Instagram para o Kanban:", error);
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

      const conversations = await conversationInstagramUseCase.findAll(
        loggedUser.companyId
      );

      reply.status(200).send(conversations);
    } catch (error) {
      console.error("Erro ao buscar conversas Instagram:", error);
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

      const conversation = await conversationInstagramUseCase.findById(
        request.params.id,
        loggedUser.companyId
      );

      if (!conversation) {
        return reply.status(404).send({ error: "Conversa não encontrada" });
      }

      reply.status(200).send(conversation);
    } catch (error) {
      console.error("Erro ao buscar conversa Instagram:", error);
      reply.status(500).send({ error: "Erro interno ao buscar conversa" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: ConversationInstagramCreate }>(
    "/:id",
    async (request, reply) => {
      try {
        const loggedUser = request.user;
        if (!loggedUser?.companyId) {
          return reply.status(401).send({
            message: "Informações de usuário ou empresa ausentes no token.",
          });
        }

        const existing = await conversationInstagramUseCase.findById(
          request.params.id,
          loggedUser.companyId
        );

        if (!existing) {
          return reply.status(404).send({ error: "Conversa não encontrada" });
        }

        const updated = await conversationInstagramUseCase.update(
          request.params.id,
          request.body
        );

        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar conversa Instagram:", error);
        reply.status(500).send({ error: "Erro interno ao atualizar conversa" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const loggedUser = request.user;
      if (!loggedUser?.companyId) {
        return reply.status(401).send({
          message: "Informações de usuário ou empresa ausentes no token.",
        });
      }

      await conversationInstagramUseCase.delete(
        request.params.id,
        loggedUser.companyId
      );

      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar conversa Instagram:", error);
      reply.status(500).send({ error: "Erro interno ao deletar conversa." });
    }
  });
}
