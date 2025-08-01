import { FastifyInstance } from "fastify";
import { ContactUseCase } from "../usecases/contact-usecase";
import { CreateContact } from "../types/contact-interface";

export function contactRoutes(fastify: FastifyInstance) {
  const contactUseCase = new ContactUseCase();

  fastify.post<{ Body: CreateContact }>("/", async (request, reply) => {
    try {
      const contact = await contactUseCase.create(request.body);
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

  fastify.get("/", async (_, reply) => {
    try {
      const contacts = await contactUseCase.findAll();
      reply.status(200).send(contacts);
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
      reply.status(500).send({ error: "Erro ao buscar contatos" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const contact = await contactUseCase.findById(request.params.id);
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
        const existing = await contactUseCase.findById(request.params.id);
        if (!existing) {
          return reply.status(404).send({ error: "Contato não encontrado" });
        }

        const updated = await contactUseCase.update(request.params.id, {
          ...existing,
          ...request.body,
        });
        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar contato:", error);
        reply.status(500).send({ error: "Erro interno ao atualizar contato" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const existing = await contactUseCase.findById(request.params.id);
      if (!existing) {
        return reply.status(404).send({ error: "Contato não encontrado" });
      }

      await contactUseCase.delete(request.params.id);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar contato:", error);
      reply.status(500).send({ error: "Erro interno ao deletar contato" });
    }
  });
}
