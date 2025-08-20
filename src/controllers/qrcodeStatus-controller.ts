import { FastifyRequest, FastifyReply } from "fastify";
import { QrCodeStatusService } from "../services/qrCodeStatus-service";

interface GetStatusRequest {
  Querystring: {
    instanceName: string;
  };
}

export class QrCodeStatusController {
  constructor(private readonly qrCodeStatusService: QrCodeStatusService) {}

  async handle(request: FastifyRequest<GetStatusRequest>, reply: FastifyReply) {
    const { instanceName } = request.query;

    if (!instanceName) {
      return reply
        .status(400)
        .send({ message: "O nome da instância é obrigatório." });
    }

    try {
      const status = await this.qrCodeStatusService.getConnectionStatus(
        instanceName
      );
      return reply.status(200).send(status);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Erro interno do servidor." });
    }
  }
}
