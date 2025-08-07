import { FastifyInstance } from "fastify";
import { CompanyUseCase, LoginCredentials } from "../usecases/company-usecase";
import { CreateCompany } from "../types/company-interface";
import { authHook } from "../hooks/auth";

export function companyRoutes(fastify: FastifyInstance) {
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
      const result = await companyUseCase.login(request.body);
      reply.status(200).send(result);
    } catch (error: any) {
      return reply.status(401).send({ message: error.message });
    }
  });

  fastify.get("/me", { onRequest: [authHook] }, async (request, reply) => {
    try {
      const companyId = request.company!.id;
      const company = await companyUseCase.findById(companyId);

      if (!company) {
        return reply
          .status(404)
          .send({ error: "Empresa do token não encontrada." });
      }
      reply.status(200).send(company);
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
}
