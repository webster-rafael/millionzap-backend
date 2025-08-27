import { FastifyInstance } from "fastify";
import { ContactListUseCase } from "../usecases/contactList-usecase";
import { authHook } from "../hooks/auth";
import {
  CreateContactList,
  UpdateContactList,
} from "../types/contactList-interface";

export async function contactListRoutes(fastify: FastifyInstance) {
  const contactListUseCase = new ContactListUseCase();
  fastify.addHook("onRequest", authHook);

  fastify.get("/", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const contactLists = await contactListUseCase.findAll(companyId);
      reply.status(200).send(contactLists);
    } catch (error) {
      console.error("Erro ao buscar listas de contatos:", error);
      reply
        .status(500)
        .send({ error: "Erro interno ao buscar listas de contatos" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const contactList = await contactListUseCase.findById(
        request.params.id,
        companyId
      );
      if (!contactList) {
        return reply
          .status(404)
          .send({ error: "Lista de contatos não encontrada" });
      }
      reply.status(200).send(contactList);
    } catch (error) {
      console.error("Erro ao buscar lista de contatos:", error);
      reply
        .status(500)
        .send({ error: "Erro interno ao buscar lista de contatos" });
    }
  });

  fastify.post<{ Body: CreateContactList }>("/", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const newList = await contactListUseCase.create(request.body, companyId);
      reply.status(201).send(newList);
    } catch (error) {
      console.error("Erro ao criar lista de contatos:", error);
      reply
        .status(500)
        .send({ error: "Erro interno ao criar lista de contatos" });
    }
  });

  fastify.put<{
    Params: { id: string };
    Body: UpdateContactList;
  }>("/:id", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const { id } = request.params;

      const existing = await contactListUseCase.findById(id, companyId);
      if (!existing) {
        return reply
          .status(404)
          .send({ error: "Lista de contatos não encontrada" });
      }

      const { name, description, isActive, contactIds, campaign } =
        request.body;

      const payload: UpdateContactList = {
        name,
        description,
        isActive,
        contactIds,
        campaign,
      };

      const updatedList = await contactListUseCase.update(
        id,
        payload,
        companyId
      );

      reply.status(200).send(updatedList);
    } catch (error) {
      console.error("Erro ao atualizar lista de contatos:", error);
      if (error instanceof Error) {
        reply.status(500).send({
          message: "Erro interno ao atualizar lista",
          error: error.message,
        });
      } else {
        reply.status(500).send({ message: "Erro interno ao atualizar lista" });
      }
    }
  });

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const existing = await contactListUseCase.findById(
        request.params.id,
        companyId
      );
      if (!existing) {
        return reply
          .status(404)
          .send({ error: "Lista de contatos não encontrada" });
      }

      await contactListUseCase.delete(request.params.id, companyId);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar lista de contatos:", error);
      reply
        .status(500)
        .send({ error: "Erro interno ao deletar lista de contatos" });
    }
  });
}
