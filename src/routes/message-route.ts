import { FastifyInstance } from "fastify";
import { MessageUseCase } from "../usecases/message-usecase";
import { MessageCreate, MessageUpdate } from "../types/message-interface";

export async function messageRoutes(fastify: FastifyInstance) {
  const messageUseCase = new MessageUseCase();

  // Rota para CRIAR uma nova mensagem
  fastify.post<{ Body: MessageCreate }>("/", async (request, reply) => {
    try {
      const message = await messageUseCase.create(request.body);
      return reply.status(201).send(message);
    } catch (error) {
      console.error("Erro ao criar mensagem:", error);
      return reply
        .status(500)
        .send({ error: "Erro interno ao criar mensagem" });
    }
  });

  fastify.get("/", async (request, reply) => {
    try {
      const messages = await messageUseCase.findAll();
      return reply.status(200).send(messages);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      return reply
        .status(500)
        .send({ error: "Erro interno ao buscar mensagens" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const message = await messageUseCase.findById(id);
      if (!message) {
        return reply.status(404).send({ error: "Mensagem não encontrada" });
      }
      return reply.status(200).send(message);
    } catch (error) {
      console.error("Erro ao buscar mensagem:", error);
      return reply
        .status(500)
        .send({ error: "Erro interno ao buscar mensagem" });
    }
  });

  // Rota para ATUALIZAR uma mensagem
  fastify.put<{ Params: { id: string }; Body: MessageUpdate }>(
    "/:id",
    async (request, reply) => {
      try {
        const { id } = request.params;
        const message = await messageUseCase.update(id, request.body);
        return reply.status(200).send(message);
      } catch (error) {
        console.error("Erro ao atualizar mensagem:", error);
        return reply
          .status(500)
          .send({ error: "Erro interno ao atualizar mensagem" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      await messageUseCase.delete(id);
      return reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error);
      return reply
        .status(500)
        .send({ error: "Erro interno ao deletar mensagem" });
    }
  });
}
