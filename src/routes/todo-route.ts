import { FastifyInstance } from "fastify";
import { ToDoUseCase } from "../usecases/todo-usecase";
import { CreateToDo } from "../types/todo-interface";
import { authHook } from "../hooks/auth";

export async function todosRoutes(fastify: FastifyInstance) {
  const todoUseCase = new ToDoUseCase();
  fastify.addHook("onRequest", authHook);

  fastify.post<{ Body: CreateToDo }>("/", async (request, reply) => {
    try {
      const userId = request.user!.id;

      const todo = await todoUseCase.create(request.body, userId);

      reply.status(201).send(todo);
    } catch (error) {
      console.error("Erro ao criar ToDo:", error);
      reply.status(500).send({ error: "Erro interno ao criar ToDo" });
    }
  });

  fastify.get("/", async (request, reply) => {
    try {
      const userId = request.user!.id;
      const todos = await todoUseCase.findAll(userId);
      reply.status(200).send(todos);
    } catch (error) {
      console.error("Erro ao buscar ToDos:", error);
      reply.status(500).send({ error: "Erro ao buscar os ToDos" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const userId = request.user!.id;
      const todo = await todoUseCase.findById(request.params.id, userId);

      if (!todo) {
        return reply.status(404).send({ error: "ToDo não encontrado" });
      }

      reply.status(200).send(todo);
    } catch (error) {
      console.error("Erro ao buscar ToDo:", error);
      reply.status(500).send({ error: "Erro interno ao buscar ToDo" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: Partial<CreateToDo> }>(
    "/:id",
    async (request, reply) => {
      try {
        const userId = request.user!.id;
        const updated = await todoUseCase.update(
          request.params.id,
          request.body,
          userId
        );
        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar ToDo:", error);
        reply.status(500).send({ error: "Erro interno ao atualizar ToDo" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const userId = request.user!.id;
      await todoUseCase.delete(request.params.id, userId);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar ToDo:", error);
      reply.status(500).send({ error: "Erro interno ao deletar ToDo" });
    }
  });
}
