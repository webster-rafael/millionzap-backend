import { FastifyInstance } from "fastify";
import { ConfigurationUseCase } from "../usecases/configuration-usecase";
import { Configuration } from "../types/configuration-interface";

export async function configurationRoutes(fastify: FastifyInstance) {
  const configurationUseCase = new ConfigurationUseCase();

  fastify.post<{ Body: Configuration }>("/", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const configuration = await configurationUseCase.create(
        request.body,
        companyId
      );
      reply.status(201).send(configuration);
    } catch (error: any) {
      console.error("Erro ao criar configuração:", error);
      if (error?.code === "P2002") {
        return reply.status(400).send({
          code: "P2002",
          message: "Configuração já cadastrada.",
        });
      }

      reply.status(500).send({ error: "Erro interno ao criar configuração" });
    }
  });

  fastify.get("/", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const configurations = await configurationUseCase.findAll(companyId);
      reply.status(200).send(configurations);
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      reply.status(500).send({ error: "Erro ao buscar configurações" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const configuration = await configurationUseCase.findById(
        request.params.id,
        companyId
      );
      if (!configuration) {
        return reply.status(404).send({ error: "Configuração não encontrada" });
      }
      reply.status(200).send(configuration);
    } catch (error) {
      console.error("Erro ao buscar configuração:", error);
      reply.status(500).send({ error: "Erro interno ao buscar configuração" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: Partial<Configuration> }>(
    "/:id",
    async (request, reply) => {
      try {
        const companyId = request.user!.companyId;
        const existing = await configurationUseCase.findById(
          request.params.id,
          companyId
        );
        if (!existing) {
          return reply
            .status(404)
            .send({ error: "Configuração não encontrada" });
        }

        const updated = await configurationUseCase.update(
          request.params.id,
          {
            ...existing,
            ...request.body,
          },
          companyId
        );
        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar configuração:", error);
        reply
          .status(500)
          .send({ error: "Erro interno ao atualizar configuração" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const existing = await configurationUseCase.findById(
        request.params.id,
        companyId
      );
      if (!existing) {
        return reply.status(404).send({ error: "Configuração não encontrada" });
      }

      await configurationUseCase.delete(request.params.id, companyId);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar configuração:", error);
      reply.status(500).send({ error: "Erro interno ao deletar configuração" });
    }
  });
}
