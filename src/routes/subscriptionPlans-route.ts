import { FastifyInstance } from "fastify";
import { CreateSubscriptionPlan } from "../types/subscriptionPlans-interface";
import { authHook } from "../hooks/auth";
import { SubscriptionPlanUseCase } from "../usecases/subscriptionPlans-usecase";

export async function subscriptionPlanRoutes(fastify: FastifyInstance) {
  const subscriptionPlanUseCase = new SubscriptionPlanUseCase();
  fastify.addHook("onRequest", authHook);

  fastify.post<{ Body: CreateSubscriptionPlan }>(
    "/",
    async (request, reply) => {
      try {
        const plan = await subscriptionPlanUseCase.create(request.body);
        reply.status(201).send(plan);
      } catch (error) {
        reply.status(500).send({ error: "Erro interno ao criar plano" });
      }
    }
  );

  fastify.get("/", async (request, reply) => {
    try {
      const plans = await subscriptionPlanUseCase.findAll();
      reply.status(200).send(plans);
    } catch (error) {
      reply.status(500).send({ error: "Erro ao buscar os planos" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const plan = await subscriptionPlanUseCase.findById(request.params.id);
      if (!plan) {
        return reply.status(404).send({ error: "Plano não encontrado" });
      }
      reply.status(200).send(plan);
    } catch (error) {
      reply.status(500).send({ error: "Erro interno ao buscar plano" });
    }
  });

  fastify.put<{
    Params: { id: string };
    Body: Partial<CreateSubscriptionPlan>;
  }>("/:id", async (request, reply) => {
    try {
      const updated = await subscriptionPlanUseCase.update(
        request.params.id,
        request.body
      );
      reply.status(200).send(updated);
    } catch (error) {
      reply.status(500).send({ error: "Erro interno ao atualizar plano" });
    }
  });

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      await subscriptionPlanUseCase.delete(request.params.id);
      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({ error: "Erro interno ao deletar plano" });
    }
  });
}
