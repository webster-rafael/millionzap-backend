import { FastifyInstance } from "fastify";
import { PromptUseCase } from "../usecases/prompt-usecase";
import { PromptCreate, PromptCreateInput } from "../types/prompt-interface";
import { authHook } from "../hooks/auth";

export function promptRoutes(fastify: FastifyInstance) {
  const promptUseCase = new PromptUseCase();
  fastify.addHook("onRequest", authHook);
  fastify.post<{ Body: PromptCreate }>("/", async (request, reply) => {
    try {
      const companyId = request.company!.id;
      const prompt = await promptUseCase.create(
        request.body as PromptCreateInput,
        companyId
      );
      reply.status(201).send(prompt);
    } catch (error) {
      console.error("Erro ao criar prompt:", error);
      reply.status(500).send({ error: "Erro interno ao criar prompt" });
    }
  });

  fastify.get("/", async (request, reply) => {
    try {
      const companyId = request.company!.id;
      const prompts = await promptUseCase.findAll(companyId);
      reply.status(200).send(prompts);
    } catch (error) {
      console.error("Erro ao buscar prompts:", error);
      reply.status(500).send({ error: "Erro ao buscar prompts" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const companyId = request.company!.id;
      const prompt = await promptUseCase.findById(request.params.id, companyId);
      if (!prompt) {
        return reply.status(404).send({ error: "Prompt não encontrado" });
      }
      reply.status(200).send(prompt);
    } catch (error) {
      console.error("Erro ao buscar prompt:", error);
      reply.status(500).send({ error: "Erro interno ao buscar prompt" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: PromptCreate }>(
    "/:id",
    async (request, reply) => {
      try {
        const companyId = request.company!.id;
        const existing = await promptUseCase.findById(
          request.params.id,
          companyId
        );
        if (!existing) {
          return reply.status(404).send({ error: "Prompt não encontrado" });
        }

        const updated = await promptUseCase.update(
          {
            ...existing,
            ...request.body,
            id: request.params.id,
          },
          companyId
        );

        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar prompt:", error);
        reply.status(500).send({ error: "Erro interno ao atualizar prompt" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const companyId = request.company!.id;
      const existing = await promptUseCase.findById(
        request.params.id,
        companyId
      );
      if (!existing) {
        return reply.status(404).send({ error: "Prompt não encontrado" });
      }

      await promptUseCase.delete(request.params.id, companyId);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar prompt:", error);
      reply.status(500).send({ error: "Erro interno ao deletar prompt" });
    }
  });
}
