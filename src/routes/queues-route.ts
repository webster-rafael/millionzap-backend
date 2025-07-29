import { FastifyInstance } from "fastify";
import { QueueUseCase } from "../usecases/queue-usecase";
import { QueueCreate, QueueCreateInput } from "../types/queue-interface";

export function queuesRoutes(fastify: FastifyInstance) {
  const queueUseCase = new QueueUseCase();
  fastify.post<{ Body: QueueCreate }>("/", async (request, reply) => {
    try {
      const queue = await queueUseCase.create(request.body);
      reply.status(201).send(queue);
    } catch (error) {
      reply.status(500).send({ error: "Erro interno ao criar fila" });
    }
  });

  fastify.get("/", async (_, reply) => {
    try {
      const queues = await queueUseCase.findAll();
      reply.status(200).send(queues);
    } catch (error) {
      console.error("Erro ao buscar filas:", error);
      reply.status(500).send({ error: "Erro ao buscar as filas" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const queue = await queueUseCase.findById(request.params.id);
      if (!queue) {
        return reply.status(404).send({ error: "Fila não encontrada" });
      }
      reply.status(200).send(queue);
    } catch (error) {
      console.error("Erro ao buscar fila:", error);
      reply.status(500).send({ error: "Erro interno ao buscar fila" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: QueueCreate }>(
    "/:id",
    async (request, reply) => {
      try {
        const existing = await queueUseCase.findById(request.params.id);
        if (!existing) {
          return reply.status(404).send({ error: "Fila não encontrada" });
        }

        const updated = await queueUseCase.update({
          ...existing,
          ...request.body,
          id: request.params.id,
        });

        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar fila:", error);
        reply.status(500).send({ error: "Erro interno ao atualizar fila" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const existing = await queueUseCase.findById(request.params.id);
      if (!existing) {
        return reply.status(404).send({ error: "Fila não encontrada" });
      }

      await queueUseCase.delete(request.params.id);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar fila:", error);
      reply.status(500).send({ error: "Erro interno ao deletar fila" });
    }
  });
}
