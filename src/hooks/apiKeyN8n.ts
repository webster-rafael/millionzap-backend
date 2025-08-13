import { FastifyRequest, FastifyReply } from "fastify";

export async function apiKeyAuthHook(request: FastifyRequest, reply: FastifyReply) {
  const providedKey = request.headers['x-api-key'];

  if (!providedKey) {
    return reply
      .status(401)
      .send({ message: "Chave de API (x-api-key) não fornecida." });
  }

  if (providedKey !== process.env.N8N_API_KEY) {
    return reply.status(403).send({ message: "Chave de API inválida." });
  }
}