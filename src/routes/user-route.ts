import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecases/user-usecase";
import { UserCreate, UserCreateInput } from "../types/user-interface";

export function userRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase();

  fastify.post<{ Body: UserCreateInput }>("/", async (request, reply) => {
    try {
      const user = await userUseCase.create(request.body);
      reply.status(201).send(user);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      reply.status(500).send({ error: "Erro interno ao criar usuário" });
    }
  });

  fastify.get("/", async (_, reply) => {
    try {
      const users = await userUseCase.findAll();
      reply.status(200).send(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      reply.status(500).send({ error: "Erro ao buscar os usuários" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const user = await userUseCase.findById(request.params.id);
      if (!user) {
        return reply.status(404).send({ error: "Usuário não encontrado" });
      }
      reply.status(200).send(user);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      reply.status(500).send({ error: "Erro interno ao buscar usuário" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: UserCreate }>(
    "/:id",
    async (request, reply) => {
      try {
        const existing = await userUseCase.findById(request.params.id);
        if (!existing) {
          return reply.status(404).send({ error: "Usuário não encontrado" });
        }

        const updated = await userUseCase.update(request.params.id, {
          ...existing,
          ...request.body,
        });
        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        reply.status(500).send({ error: "Erro interno ao atualizar usuário" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const existing = await userUseCase.findById(request.params.id);
      if (!existing) {
        return reply.status(404).send({ error: "Usuário não encontrado" });
      }

      await userUseCase.delete(request.params.id);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      reply.status(500).send({ error: "Erro interno ao deletar usuário" });
    }
  });
}
