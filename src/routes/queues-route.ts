import { FastifyInstance } from "fastify";
import { QueueUseCase } from "../usecases/queue-usecase";
import { QueueCreate } from "../types/queue-interface";
import { authHook } from "../hooks/auth";

export async function queuesRoutes(fastify: FastifyInstance) {
  const queueUseCase = new QueueUseCase();
  fastify.addHook("onRequest", authHook);
  fastify.post<{ Body: QueueCreate }>("/", async (request, reply) => {
    try {
      const queue = await queueUseCase.create(request.body);
      reply.status(201).send(queue);
    } catch (error) {
      reply.status(500).send({ error: "Erro interno ao criar fila" });
    }
  });

  fastify.get("/", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const queues = await queueUseCase.findAll(companyId);
      reply.status(200).send(queues);
    } catch (error) {
      console.error("Erro ao buscar filas:", error);
      reply.status(500).send({ error: "Erro ao buscar as filas" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const queue = await queueUseCase.findById(request.params.id, companyId);
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
        const companyId = request.user!.companyId;
        const existing = await queueUseCase.findById(
          request.params.id,
          companyId
        );
        if (!existing) {
          return reply.status(404).send({ error: "Fila não encontrada" });
        }

        const updated = await queueUseCase.update(request.params.id, {
          ...existing,
          ...request.body,
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
      const companyId = request.user!.companyId;
      const existing = await queueUseCase.findById(
        request.params.id,
        companyId
      );
      if (!existing) {
        return reply.status(404).send({ error: "Fila não encontrada" });
      }

      await queueUseCase.delete(request.params.id, companyId);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar fila:", error);
      reply.status(500).send({ error: "Erro interno ao deletar fila" });
    }
  });
}
