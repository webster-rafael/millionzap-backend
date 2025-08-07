import { FastifyInstance } from "fastify";
import { TagUseCase } from "../usecases/tag-usecase";
import { CreateTags } from "../types/tag-interface";
import { authHook } from "../hooks/auth"; // 1. Importe o hook de autenticação

export function tagsRoutes(fastify: FastifyInstance) {
  const tagUseCase = new TagUseCase();
  fastify.addHook("onRequest", authHook);
  fastify.post<{ Body: CreateTags }>("/", async (request, reply) => {
    try {
      const companyId = request.company!.id;

      const tag = await tagUseCase.create(request.body, companyId);
      reply.status(201).send(tag);
    } catch (error) {
      console.error("Erro ao criar tag:", error);
      reply.status(500).send({ error: "Erro interno ao criar tag" });
    }
  });

  fastify.get("/", async (request, reply) => {
    try {
      const companyId = request.company!.id;
      const tags = await tagUseCase.findAll(companyId);
      reply.status(200).send(tags);
    } catch (error) {
      console.error("Erro ao buscar tags:", error);
      reply.status(500).send({ error: "Erro ao buscar as tags" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const companyId = request.company!.id;
      const tag = await tagUseCase.findById(request.params.id, companyId);
      if (!tag) {
        return reply.status(404).send({ error: "Tag não encontrada" });
      }
      reply.status(200).send(tag);
    } catch (error) {
      console.error("Erro ao buscar tag:", error);
      reply.status(500).send({ error: "Erro interno ao buscar tag" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: Partial<CreateTags> }>(
    "/:id",
    async (request, reply) => {
      try {
        const companyId = request.company!.id;
        const updated = await tagUseCase.update(
          request.params.id,
          request.body,
          companyId
        );
        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar tag:", error);
        reply.status(500).send({ error: "Erro interno ao atualizar tag" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const companyId = request.company!.id;
      await tagUseCase.delete(request.params.id, companyId);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar tag:", error);
      reply.status(500).send({ error: "Erro interno ao deletar tag" });
    }
  });
}
