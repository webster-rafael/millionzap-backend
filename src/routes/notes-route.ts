import { FastifyInstance } from "fastify";
import { noteUseCase } from "../usecases/note-usecase";
import { NoteCreateInput } from "../types/note-interface";

export async function noteRoutes(fastify: FastifyInstance) {
  const notesUseCase = new noteUseCase();

  fastify.post<{ Body: NoteCreateInput; Params: { contactId: string } }>(
    "/:contactId",
    async (request, reply) => {
      try {
        const note = await notesUseCase.create(
          request.body,
          request.params.contactId
        );
        reply.status(201).send(note);
      } catch (error) {
        console.error("Erro ao criar nota:", error);
        reply.status(500).send({ error: "Erro interno ao criar nota" });
      }
    }
  );

  fastify.get<{ Params: { contactId: string } }>(
    "/contact/:contactId",
    async (request, reply) => {
      try {
        const notes = await notesUseCase.findAll(request.params.contactId);
        reply.status(200).send(notes);
      } catch (error) {
        console.error("Erro ao buscar notas:", error);
        reply.status(500).send({ error: "Erro ao buscar notas" });
      }
    }
  );

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const note = await notesUseCase.findById(request.params.id);
      if (!note) {
        return reply.status(404).send({ error: "Nota não encontrada" });
      }
      reply.status(200).send(note);
    } catch (error) {
      console.error("Erro ao buscar nota:", error);
      reply.status(500).send({ error: "Erro interno ao buscar nota" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: Partial<NoteCreateInput> }>(
    "/:id",
    async (request, reply) => {
      try {
        const existing = await notesUseCase.findById(request.params.id);
        if (!existing) {
          return reply.status(404).send({ error: "Nota não encontrada" });
        }

        const updated = await notesUseCase.update(
          request.params.id,
          request.body
        );

        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar nota:", error);
        reply.status(500).send({ error: "Erro interno ao atualizar nota" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const existing = await notesUseCase.findById(request.params.id);
      if (!existing) {
        return reply.status(404).send({ error: "Nota não encontrada" });
      }

      await notesUseCase.delete(request.params.id);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar nota:", error);
      reply.status(500).send({ error: "Erro interno ao deletar nota" });
    }
  });
}
