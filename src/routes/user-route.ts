import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecases/user-usecase";
import { UserCreate, UserCreateInput } from "../types/user-interface";
import { UserRepositoryPrisma } from "../repositories/user-repository";

export async function userRoutes(fastify: FastifyInstance) {
  const userRepository = new UserRepositoryPrisma();
  const userUseCase = new UserUseCase(userRepository);

  fastify.post<{ Body: UserCreateInput }>("/", async (request, reply) => {
    try {
      const loggedUser = request.user;
      if (!loggedUser?.companyId) {
        return reply.status(401).send({
          message: "Informações de usuário ou empresa ausentes no token.",
        });
      }
      const companyId = loggedUser.companyId;
      const user = await userUseCase.create(request.body, companyId);
      reply.status(201).send(user);
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      if (error?.code === "P2002") {
        return reply.status(400).send({
          code: "P2002",
          message: "E-mail já cadastrado",
        });
      }
      reply.status(500).send({ error: "Erro interno ao criar usuário" });
    }
  });

  fastify.get("/", async (request, reply) => {
    try {
      const loggedUser = request.user;
      if (!loggedUser?.companyId) {
        return reply.status(401).send({
          message: "Informações de usuário ou empresa ausentes no token.",
        });
      }

      const companyId = loggedUser.companyId;

      const users = await userUseCase.findAll(companyId);

      reply.status(200).send(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      reply.status(500).send({ error: "Erro ao buscar os usuários" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const loggedUser = request.user;
      if (!loggedUser?.companyId) {
        return reply.status(401).send({
          message: "Informações de usuário ou empresa ausentes no token.",
        });
      }
      const companyId = loggedUser.companyId;
      const user = await userUseCase.findById(request.params.id, companyId);
      if (!user) {
        return reply.status(404).send({ error: "Usuário não encontrado" });
      }
      reply.status(200).send(user);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      reply.status(500).send({ error: "Erro interno ao buscar usuário" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: UserCreateInput }>(
    "/:id",
    async (request, reply) => {
      try {
        const loggedUser = request.user;
        if (!loggedUser?.companyId) {
          return reply.status(401).send({
            message: "Informações de usuário ou empresa ausentes no token.",
          });
        }
        const companyId = loggedUser.companyId;
        const existing = await userUseCase.findById(
          request.params.id,
          companyId
        );
        if (!existing) {
          return reply.status(404).send({ error: "Usuário não encontrado" });
        }

         const updated = await userUseCase.update(
        request.params.id,
        request.body,
        companyId
      );
        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        reply.status(500).send({ error: "Erro interno ao atualizar usuário" });
      }
    }
  );

  fastify.get<{ Querystring: { email: string } }>(
    "/email",
    async (request, reply) => {
      try {
        const loggedUser = request.user;
        if (!loggedUser?.companyId) {
          return reply.status(401).send({
            message: "Informações de usuário ou empresa ausentes no token.",
          });
        }

        const user = await userUseCase.findByEmail(request.query.email);
        if (!user) {
          return reply.status(404).send({ error: "Usuário não encontrado" });
        }
        reply.status(200).send(user);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        reply.status(500).send({ error: "Erro interno ao buscar usuário" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const loggedUser = request.user;
      if (!loggedUser?.companyId) {
        return reply.status(401).send({
          message: "Informações de usuário ou empresa ausentes no token.",
        });
      }
      const companyId = loggedUser.companyId;
      const existing = await userUseCase.findById(request.params.id, companyId);
      if (!existing) {
        return reply.status(404).send({ error: "Usuário não encontrado" });
      }

      await userUseCase.delete(request.params.id, companyId);
      reply.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      reply.status(500).send({ error: "Erro interno ao deletar usuário" });
    }
  });
}
