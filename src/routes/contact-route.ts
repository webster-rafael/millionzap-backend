import { FastifyInstance } from "fastify";
import { ContactUseCase } from "../usecases/contact-usecase";
import { CreateContact } from "../types/contact-interface";
import { authHook } from "../hooks/auth";

export function contactRoutes(fastify: FastifyInstance) {
  const contactUseCase = new ContactUseCase();
  fastify.addHook("onRequest", authHook);
  fastify.post<{ Body: CreateContact }>("/", async (request, reply) => {
    try {
      const companyId = request.company!.id;
      const contact = await contactUseCase.create(request.body, companyId);
      reply.status(201).send(contact);
    } catch (error: any) {
      console.error("Erro ao criar contato:", error);
      if (error?.code === "P2002") {
        return reply.status(400).send({
          code: "P2002",
          message: "Telefone já cadastrado.",
        });
      }

      reply.status(500).send({ error: "Erro interno ao criar contato" });
    }
  });

  fastify.get("/", async (request, reply) => {
    try {
      const companyId = request.company!.id;
      const contacts = await contactUseCase.findAll(companyId);
      reply.status(200).send(contacts);
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
      reply.status(500).send({ error: "Erro ao buscar contatos" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const companyId = request.company!.id;
      const contact = await contactUseCase.findById(
        request.params.id,
        companyId
      );
      if (!contact) {
        return reply.status(404).send({ error: "Contato não encontrado" });
      }
      reply.status(200).send(contact);
    } catch (error) {
      console.error("Erro ao buscar contato:", error);
      reply.status(500).send({ error: "Erro interno ao buscar contato" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: Partial<CreateContact> }>(
    "/:id",
    async (request, reply) => {
      try {
        const companyId = request.company!.id;
        const existing = await contactUseCase.findById(
          request.params.id,
          companyId
        );
        if (!existing) {
          return reply.status(404).send({ error: "Contato não encontrado" });
        }

        const updated = await contactUseCase.update(
          request.params.id,
          {
            ...existing,
            ...request.body,
          },
          companyId
        );
        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar contato:", error);
        reply.status(500).send({ error: "Erro interno ao atualizar contato" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const companyId = request.company!.id;
      const existing = await contactUseCase.findById(
        request.params.id,
        companyId
      );
      if (!existing) {
        return reply.status(404).send({ error: "Contato não encontrado" });
      }

      await contactUseCase.delete(request.params.id, companyId);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar contato:", error);
      reply.status(500).send({ error: "Erro interno ao deletar contato" });
    }
  });
}
