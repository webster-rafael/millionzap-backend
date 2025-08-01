import { FastifyInstance } from "fastify";
import { TagUseCase } from "../usecases/tag-usecase";
import { CreateTags } from "../types/tag-interface";

export function tagsRoutes(fastify: FastifyInstance) {
  const tagUseCase = new TagUseCase();

  fastify.post<{ Body: CreateTags }>("/", async (request, reply) => {
    try {
      const tag = await tagUseCase.create(request.body);
      reply.status(201).send(tag);
    } catch (error) {
      console.error("Erro ao criar tag:", error);
      reply.status(500).send({ error: "Erro interno ao criar tag" });
    }
  });

  fastify.get("/", async (_, reply) => {
    try {
      const tags = await tagUseCase.findAll();
      reply.status(200).send(tags);
    } catch (error) {
      console.error("Erro ao buscar tags:", error);
      reply.status(500).send({ error: "Erro ao buscar as tags" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const tag = await tagUseCase.findById(request.params.id);
      if (!tag) {
        return reply.status(404).send({ error: "Tag não encontrada" });
      }
      reply.status(200).send(tag);
    } catch (error) {
      console.error("Erro ao buscar tag:", error);
      reply.status(500).send({ error: "Erro interno ao buscar tag" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: CreateTags }>(
    "/:id",
    async (request, reply) => {
      try {
        const existing = await tagUseCase.findById(request.params.id);
        if (!existing) {
          return reply.status(404).send({ error: "Tag não encontrada" });
        }

        const updated = await tagUseCase.update(request.params.id, {
          ...existing,
          ...request.body,
        });
        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar tag:", error);
        reply.status(500).send({ error: "Erro interno ao atualizar tag" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const existing = await tagUseCase.findById(request.params.id);
      if (!existing) {
        return reply.status(404).send({ error: "Tag não encontrada" });
      }

      await tagUseCase.delete(request.params.id);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar tag:", error);
      reply.status(500).send({ error: "Erro interno ao deletar tag" });
    }
  });
}
