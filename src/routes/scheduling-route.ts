import { FastifyInstance } from "fastify";
import { SchedulingUseCase } from "../usecases/scheduling-usecase";
import { CreateScheduling } from "../types/scheduling-interface";
import { authHook } from "../hooks/auth";

export async function schedulingRoutes(fastify: FastifyInstance) {
  const schedulingUseCase = new SchedulingUseCase();
  fastify.addHook("onRequest", authHook);

  fastify.post<{ Body: CreateScheduling }>("/", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const scheduling = await schedulingUseCase.create(
        request.body,
        companyId
      );
      reply.status(201).send(scheduling);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      reply.status(500).send({ error: "Erro interno ao criar agendamento" });
    }
  });

  fastify.get("/", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const schedulings = await schedulingUseCase.findAll(companyId);
      reply.status(200).send(schedulings);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      reply.status(500).send({ error: "Erro ao buscar agendamentos" });
    }
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      const companyId = request.user!.companyId;
      const scheduling = await schedulingUseCase.findById(
        request.params.id,
        companyId
      );
      if (!scheduling) {
        return reply
          .status(404)
          .send({ error: "Agendamento não encontrado" });
      }
      reply.status(200).send(scheduling);
    } catch (error) {
      console.error("Erro ao buscar agendamento:", error);
      reply.status(500).send({ error: "Erro interno ao buscar agendamento" });
    }
  });

  fastify.put<{ Params: { id: string }; Body: Partial<CreateScheduling> }>(
    "/:id",
    async (request, reply) => {
      try {
        const companyId = request.user!.companyId;
        const existing = await schedulingUseCase.findById(
          request.params.id,
          companyId
        );
        if (!existing) {
          return reply
            .status(404)
            .send({ error: "Agendamento não encontrado" });
        }

        const updated = await schedulingUseCase.update(
          request.params.id,
          request.body,
          companyId
        );

        reply.status(200).send(updated);
      } catch (error) {
        console.error("Erro ao atualizar agendamento:", error);
        reply
          .status(500)
          .send({ error: "Erro interno ao atualizar agendamento" });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    async (request, reply) => {
      try {
        const companyId = request.user!.companyId;
        const existing = await schedulingUseCase.findById(
          request.params.id,
          companyId
        );
        if (!existing) {
          return reply
            .status(404)
            .send({ error: "Agendamento não encontrado" });
        }

        await schedulingUseCase.delete(request.params.id, companyId);
        reply.status(204).send();
      } catch (error) {
        console.error("Erro ao deletar agendamento:", error);
        reply
          .status(500)
          .send({ error: "Erro interno ao deletar agendamento" });
      }
    }
  );
}
