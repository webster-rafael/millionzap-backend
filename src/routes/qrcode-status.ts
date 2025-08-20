import { FastifyInstance } from "fastify";
import { QrCodeStatusService } from "../services/qrCodeStatus-service";
import { authHook } from "../hooks/auth";

export function qrcodeStatusRoutes(fastify: FastifyInstance) {
  const apiKey = process.env.API_GLOBAL_KEY_EVOLUTION;
  if (!apiKey) {
    throw new Error("A chave de API não está definida no ambiente.");
  }

  const qrCodeStatusService = new QrCodeStatusService(apiKey);

  fastify.addHook("onRequest", authHook);

  fastify.get("/qrcode-status", async (request, reply) => {
    try {
      const instanceName = (request.query as { instanceName: string })
        .instanceName;

      if (!instanceName) {
        return reply
          .status(400)
          .send({ message: "O nome da instância é obrigatório." });
      }

      const status = await qrCodeStatusService.getConnectionStatus(
        instanceName
      );
      reply.status(200).send(status);
    } catch (error) {
      console.error("Erro ao buscar o status da conexão:", error);
      reply
        .status(500)
        .send({ error: "Erro interno ao buscar o status da conexão" });
    }
  });
}
