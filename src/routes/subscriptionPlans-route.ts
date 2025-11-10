import { FastifyInstance } from "fastify";
import { PlanStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { CreateSubscriptionPlan } from "../types/subscriptionPlans-interface";
import { authHook } from "../hooks/auth";
import { SubscriptionPlanUseCase } from "../usecases/subscriptionPlans-usecase";

type SubscriptionPlanRequestBody = {
  name: string;
  price: number;
  features: string[];
  description?: string | null;
  status?: PlanStatus;
  firstMonth?: boolean | null;
  nextMonthsPrice?: number | null;
  checkoutUrl?: string | null;
};

type SubscriptionPlanUpdateRequestBody = Partial<SubscriptionPlanRequestBody>;

const mapCreatePayload = (
  body: SubscriptionPlanRequestBody
): CreateSubscriptionPlan => ({
  ...body,
  price: new Decimal(body.price),
  nextMonthsPrice:
    body.nextMonthsPrice === undefined || body.nextMonthsPrice === null
      ? null
      : new Decimal(body.nextMonthsPrice),
});

const mapUpdatePayload = (
  body: SubscriptionPlanUpdateRequestBody
): Partial<CreateSubscriptionPlan> => {
  const payload: Partial<CreateSubscriptionPlan> = {};

  if (body.name !== undefined) {
    payload.name = body.name;
  }
  if (body.price !== undefined) {
    payload.price = new Decimal(body.price);
  }
  if (body.features !== undefined) {
    payload.features = body.features;
  }
  if (body.description !== undefined) {
    payload.description = body.description;
  }
  if (body.status !== undefined) {
    payload.status = body.status;
  }
  if (body.firstMonth !== undefined) {
    payload.firstMonth = body.firstMonth;
  }
  if (body.nextMonthsPrice !== undefined) {
    payload.nextMonthsPrice =
      body.nextMonthsPrice === null
        ? null
        : new Decimal(body.nextMonthsPrice);
  }
  if (body.checkoutUrl !== undefined) {
    payload.checkoutUrl = body.checkoutUrl;
  }

  return payload;
};

export async function subscriptionPlanRoutes(fastify: FastifyInstance) {
  const subscriptionPlanUseCase = new SubscriptionPlanUseCase();
  fastify.addHook("onRequest", authHook);

  fastify.post<{ Body: SubscriptionPlanRequestBody }>(
    "/",
    async (request, reply) => {
      try {
        const payload = mapCreatePayload(request.body);
        const plan = await subscriptionPlanUseCase.create(payload);
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
    Body: SubscriptionPlanUpdateRequestBody;
  }>("/:id", async (request, reply) => {
    try {
      const payload = mapUpdatePayload(request.body);
      const updated = await subscriptionPlanUseCase.update(
        request.params.id,
        payload
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
