import { FastifyInstance } from "fastify";
import { QuickResponseCreate } from "../types/quickResponses-interface";
import { QuickResponseUseCase } from "../usecases/quickresponse-usecase";

export async function quickResponseRoutes(fastify: FastifyInstance) {
  const quickResponseUseCase = new QuickResponseUseCase();
  fastify.post<{ Body: QuickResponseCreate }>("/", async (request, reply) => {
    const { title, shortcut, queueId } = request.body;
    try {
      const data = await quickResponseUseCase.create({
        title,
        shortcut,
        queueId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      reply.status(201).send(data);
    } catch (error) {
      reply.status(500).send({ error: "Houve um erro interno" });
    }
  });
}
