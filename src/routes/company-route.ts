import { FastifyInstance } from "fastify";
import { CompanyUseCase, LoginCredentials } from "../usecases/company-usecase";
import { CreateCompany } from "../types/company-interface";
import { authHook } from "../hooks/auth";
import { prisma } from "../database/prisma-client";

export async function companyRoutes(fastify: FastifyInstance) {
  const companyUseCase = new CompanyUseCase();

  fastify.post<{ Body: CreateCompany }>("/", async (request, reply) => {
    try {
      const result = await companyUseCase.create(request.body);
      reply.status(201).send(result);
    } catch (error: any) {
      if (error?.code === "P2002") {
        return reply.status(400).send({
          code: "P2002",
          message: "E-mail já cadastrado.",
        });
      }
      reply.status(500).send({ error: "Erro interno ao criar empresa" });
    }
  });

  fastify.post<{ Body: LoginCredentials }>("/login", async (request, reply) => {
    try {
      const loginResult = await companyUseCase.login(request.body);
      const { token, ...companyData } = loginResult;

      reply.setCookie("authToken", token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });

      return reply.status(200).send(companyData);
    } catch (error: any) {
      return reply.status(401).send({ message: error.message });
    }
  });

  fastify.get("/me", { onRequest: [authHook] }, async (request, reply) => {
    try {
      const userWithDetails = await prisma.user.findUnique({
        where: {
          id: request.user?.id,
        },
        include: {
          company: true,
          queues: {
            include: {
              queue: true,
            },
          },
        },
      });

      if (!userWithDetails) {
        return reply
          .status(404)
          .send({ error: "Usuário do token não encontrado." });
      }

      const { company, ...restUser } = userWithDetails;

      return reply.status(200).send({
        ...restUser,
        companyName: company?.name ?? null,
      });
    } catch (error) {
      reply
        .status(500)
        .send({ error: "Erro interno ao buscar dados do usuário." });
    }
  });

  fastify.get("/", { onRequest: [authHook] }, async (request, reply) => {
    const companies = await companyUseCase.findAll();
    reply.status(200).send(companies);
  });

  fastify.get<{ Params: { id: string } }>(
    "/:id",
    { onRequest: [authHook] },
    async (request, reply) => {
      const company = await companyUseCase.findById(request.params.id);
      if (!company) {
        return reply.status(404).send({ error: "Empresa não encontrada" });
      }
      reply.status(200).send(company);
    }
  );

  fastify.put<{ Params: { id: string }; Body: Partial<CreateCompany> }>(
    "/:id",
    { onRequest: [authHook] },
    async (request, reply) => {
      const updated = await companyUseCase.update(
        request.params.id,
        request.body as any
      );
      reply.status(200).send(updated);
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { onRequest: [authHook] },
    async (request, reply) => {
      await companyUseCase.delete(request.params.id);
      reply.status(204).send();
    }
  );

  fastify.post("/logout", { onRequest: [authHook] }, (request, reply) => {
    reply.clearCookie("authToken", { path: "/" });
    return reply.status(200).send({ message: "Logout realizado com sucesso." });
  });
}
