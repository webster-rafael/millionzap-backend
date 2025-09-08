import { FastifyInstance } from "fastify";
import { MessageInstagramUseCase } from "../usecases/messageInstagram-usecase";
import {
  MessageInstagramCreate,
  MessageInstagramUpdate,
} from "../types/messageInstagram-interface";

export async function messageInstagramRoutes(fastify: FastifyInstance) {
  const messageInstagramUseCase = new MessageInstagramUseCase();

  fastify.post<{ Body: MessageInstagramCreate }>(
    "/",
    async (request, reply) => {
      try {
        const message = await messageInstagramUseCase.create(request.body);
        return reply.status(201).send(message);
      } catch (error) {
        console.error("Erro ao criar mensagem Instagram:", error);
        return reply
          .status(500)
          .send({ error: "Erro interno ao criar mensagem" });
      }
    }
  );

  fastify.get("/", async (request, reply) => {
    try {
      const messages = await messageInstagramUseCase.findAll();
      return reply.status(200).send(messages);
    } catch (error) {
      console.error("Erro ao buscar mensagens Instagram:", error);
      return reply
        .status(500)
        .send({ error: "Erro interno ao buscar mensagens" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const message = await messageInstagramUseCase.findById(id);
      if (!message) {
        return reply
          .status(404)
          .send({ error: "Mensagem Instagram não encontrada" });
      }
      return reply.status(200).send(message);
    } catch (error) {
      console.error("Erro ao buscar mensagem Instagram:", error);
      return reply
        .status(500)
        .send({ error: "Erro interno ao buscar mensagem" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: MessageInstagramUpdate }>(
    "/:id",
    async (request, reply) => {
      try {
        const { id } = request.params;
        const message = await messageInstagramUseCase.update(id, request.body);
        return reply.status(200).send(message);
      } catch (error) {
        console.error("Erro ao atualizar mensagem Instagram:", error);
        return reply
          .status(500)
          .send({ error: "Erro interno ao atualizar mensagem" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      await messageInstagramUseCase.delete(id);
      return reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar mensagem Instagram:", error);
      return reply
        .status(500)
        .send({ error: "Erro interno ao deletar mensagem" });
    }
  });
}
