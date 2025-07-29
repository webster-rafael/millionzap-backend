import { FastifyInstance } from "fastify";
import {
  QuickResponse,
  QuickResponseCreate,
  QuickResponseCreateInput,
} from "../types/quickResponses-interface";
import { QuickResponseUseCase } from "../usecases/quickresponse-usecase";

export async function quickResponseRoutes(fastify: FastifyInstance) {
  const quickResponseUseCase = new QuickResponseUseCase();
  fastify.post<{ Body: QuickResponseCreateInput }>(
    "/",
    async (request, reply) => {
      try {
        const data = await quickResponseUseCase.create(request.body);
        return reply.status(201).send(data);
      } catch (error) {
        return reply
          .status(500)
          .send({ error: "Erro ao criar resposta rápida" });
      }
    }
  );

  fastify.get("/", async (request, reply) => {
    try {
      const quickResponses = await quickResponseUseCase.findAll();
      reply.status(200).send(quickResponses);
    } catch (error) {
      reply.status(500).send({ error: "Erro ao buscar as respostas rápidas" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      const quickResponse = await quickResponseUseCase.findById(id);
      if (!quickResponse) {
        return reply
          .status(404)
          .send({ error: "Resposta rápida não encontrada" });
      }
      return reply.status(200).send(quickResponse);
    } catch (error) {
      return reply
        .status(500)
        .send({ error: "Erro ao buscar resposta rápida" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: QuickResponse }>(
    "/:id",
    async (request, reply) => {
      const { id } = request.params;
      const updates = request.body;

      try {
        const updated = await quickResponseUseCase.update({
          ...updates,
          id,
        });
        if (!updated) {
          return reply
            .status(404)
            .send({ error: "Resposta rápida não encontrada" });
        }
        return reply.status(200).send(updated);
      } catch (error) {
        return reply
          .status(500)
          .send({ error: "Erro ao atualizar resposta rápida" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const existing = await quickResponseUseCase.delete(request.params.id);
      if (!existing) {
        return reply
          .status(404)
          .send({ error: "Resposta rápida não encontrada" });
      }
      return reply.status(204).send();
    } catch (error) {
      return reply
        .status(500)
        .send({ error: "Erro ao excluir resposta rápida" });
    }
  });
}
