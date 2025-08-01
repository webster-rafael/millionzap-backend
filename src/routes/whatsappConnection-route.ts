import { FastifyInstance } from "fastify";
import { WhatsAppConnectionUseCase } from "../usecases/whatsAppConnection-usecase";
import { CreateWhatsAppConnection } from "../types/whatsappConnection-interface";

export function whatsAppConnectionRoutes(fastify: FastifyInstance) {
  const whatsAppConnectionUseCase = new WhatsAppConnectionUseCase();

  fastify.post<{ Body: CreateWhatsAppConnection }>(
    "/",
    async (request, reply) => {
      try {
        const connection = await whatsAppConnectionUseCase.create(request.body);
        reply.status(201).send(connection);
      } catch (error) {
        console.error("Erro ao criar conexão:", error);
        reply.status(500).send({ error: "Erro interno ao criar conexão" });
      }
    }
  );

  fastify.get("/", async (_, reply) => {
    try {
      const connections = await whatsAppConnectionUseCase.findAll();
      reply.status(200).send(connections);
    } catch (error) {
      console.error("Erro ao buscar conexões:", error);
      reply.status(500).send({ error: "Erro ao buscar as conexões" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const connection = await whatsAppConnectionUseCase.findById(
        request.params.id
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
        const existing = await whatsAppConnectionUseCase.findById(
          request.params.id
        );
        if (!existing) {
          return reply.status(404).send({ error: "Conexão não encontrada" });
        }

        const updated = await whatsAppConnectionUseCase.update(
          request.params.id,
          {
            ...existing,
            ...request.body,
          }
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
      const existing = await whatsAppConnectionUseCase.findById(
        request.params.id
      );
      if (!existing) {
        return reply.status(404).send({ error: "Conexão não encontrada" });
      }

      await whatsAppConnectionUseCase.delete(request.params.id);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar conexão:", error);
      reply.status(500).send({ error: "Erro interno ao deletar conexão" });
    }
  });
}
