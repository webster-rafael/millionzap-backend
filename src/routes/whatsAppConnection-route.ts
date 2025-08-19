import { FastifyInstance } from "fastify";
import { WhatsAppConnectionUseCase } from "../usecases/whatsApp-usecase";
import { CreateWhatsAppConnection } from "../types/whatsAppConnection-interface";
import { authHook } from "../hooks/auth";

export function whatsAppConnectionRoutes(fastify: FastifyInstance) {
  const whatsAppConnectionUseCase = new WhatsAppConnectionUseCase();
  fastify.addHook("onRequest", authHook);
  fastify.post<{ Body: CreateWhatsAppConnection }>(
    "/",
    async (request, reply) => {
      try {
        const companyId = request.user!.companyId;
        const connection = await whatsAppConnectionUseCase.create(
          request.body,
          companyId
        );
        reply.status(201).send(connection);
      } catch (error) {
        console.error("Erro ao criar conexão:", error);
        reply.status(500).send({ error: "Erro interno ao criar conexão" });
      }
    }
  );

  fastify.get("/", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const connections = await whatsAppConnectionUseCase.findAll(companyId);
      reply.status(200).send(connections);
    } catch (error) {
      console.error("Erro ao buscar conexões:", error);
      reply.status(500).send({ error: "Erro ao buscar as conexões" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const connection = await whatsAppConnectionUseCase.findById(
        request.params.id,
        companyId
      );
      if (!connection) {
        return reply.status(404).send({ error: "Conexão não encontrada" });
      }
      reply.status(200).send(connection);
    } catch (error) {
      console.error("Erro ao buscar conexão:", error);
      reply.status(500).send({ error: "Erro interno ao buscar conexão" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: CreateWhatsAppConnection }>(
    "/:id",
    async (request, reply) => {
      try {
        const companyId = request.user!.companyId;
        const existing = await whatsAppConnectionUseCase.findById(
          request.params.id,
          companyId
        );
        if (!existing) {
          return reply.status(404).send({ error: "Conexão não encontrada" });
        }

        const updated = await whatsAppConnectionUseCase.update(
          request.params.id,
          {
            ...existing,
            ...request.body,
          },
          companyId
        );
        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar conexão:", error);
        reply.status(500).send({ error: "Erro interno ao atualizar conexão" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const existing = await whatsAppConnectionUseCase.findById(
        request.params.id,
        companyId
      );
      if (!existing) {
        return reply.status(404).send({ error: "Conexão não encontrada" });
      }

      await whatsAppConnectionUseCase.delete(request.params.id, companyId);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar conexão:", error);
      reply.status(500).send({ error: "Erro interno ao deletar conexão" });
    }
  });
}
