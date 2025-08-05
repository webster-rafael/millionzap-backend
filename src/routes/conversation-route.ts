import { FastifyInstance } from "fastify";
import { PromptUseCase } from "../usecases/prompt-usecase";
import { PromptCreate, PromptCreateInput } from "../types/prompt-interface";
import { ConversationUseCase } from "../usecases/conversation-usecase";
import { ConversationCreate } from "../types/conversation-interface";

export function conversationRoutes(fastify: FastifyInstance) {
  const conversationUseCase = new ConversationUseCase();

  //   fastify.post<{ Body: PromptCreate }>("/", async (request, reply) => {
  //     try {
  //       const prompt = await promptUseCase.create(
  //         request.body as PromptCreateInput
  //       );
  //       reply.status(201).send(prompt);
  //     } catch (error) {
  //       console.error("Erro ao criar prompt:", error);
  //       reply.status(500).send({ error: "Erro interno ao criar prompt" });
  //     }
  //   });

  fastify.get("/", async (_, reply) => {
    try {
      const conversation = await conversationUseCase.findAll();
      reply.status(200).send(conversation);
    } catch (error) {
      console.error("Erro ao buscar conversas:", error);
      reply.status(500).send({ error: "Erro ao buscar conversas" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const conversation = await conversationUseCase.findById(
        request.params.id
      );
      if (!conversation) {
        return reply.status(404).send({ error: "Conversa não encontrado" });
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
        const existing = await conversationUseCase.findById(request.params.id);
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

  fastify.get("/kanban", async (_, reply) => {
    try {
      const kanbanConversations = await conversationUseCase.findForKanban();
      reply.status(200).send(kanbanConversations);
    } catch (error) {
      console.error("Erro ao buscar conversas para o Kanban:", error);
      reply
        .status(500)
        .send({ error: "Erro ao buscar conversas para o Kanban" });
    }
  });

  //   fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
  //     try {
  //       const existing = await promptUseCase.findById(request.params.id);
  //       if (!existing) {
  //         return reply.status(404).send({ error: "Prompt não encontrado" });
  //       }

  //       await promptUseCase.delete(request.params.id);
  //       reply.status(204).send();
  //     } catch (error) {
  //       console.error("Erro ao deletar prompt:", error);
  //       reply.status(500).send({ error: "Erro interno ao deletar prompt" });
  //     }
  //   });
}
