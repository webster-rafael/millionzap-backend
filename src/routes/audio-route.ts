import { FastifyInstance } from "fastify";
import fs from "fs/promises";
import path from "path";
import { apiKeyAuthHook } from "../hooks/apiKeyN8n.js";
import { authHook } from "../hooks/auth.js";

export async function audioRoutes(fastify: FastifyInstance) {
  const audioFolder = path.resolve(process.cwd(), "uploads", "audios");

  try {
    await fs.mkdir(audioFolder, { recursive: true });
  } catch (err) {
    console.error("ERRO CRÍTICO ao criar a pasta de áudios:", err);
  }

  fastify.post<{ Body: { fileName: string; data: string; mimeType: string } }>(
    "/audios/save",
    { onRequest: [apiKeyAuthHook] },
    async (request, reply) => {
      try {
        const { fileName, data } = request.body;

        if (!fileName || !data) {
          return reply
            .status(400)
            .send({ error: "fileName e data são obrigatórios" });
        }

        const buffer = Buffer.from(data, "base64");
        const filePath = path.join(audioFolder, fileName);
        await fs.writeFile(filePath, buffer);
        const publicUrl = `${process.env.BACKEND_URL}/uploads/audios/${fileName}`;

        return reply.status(201).send({
          message: "Áudio salvo com sucesso",
          url: publicUrl,
        });
      } catch (err) {
        console.error("ERRO AO SALVAR O ÁUDIO:", err);
        return reply
          .status(500)
          .send({ error: "Erro interno ao salvar o áudio" });
      }
    }
  );

  fastify.get<{ Querystring: { fileName: string } }>(
    "/audios",
    { onRequest: [authHook] },
    async (request, reply) => {
      try {
        const { fileName } = request.query;

        if (!fileName) {
          return reply
            .status(400)
            .send({ error: "Nome do arquivo não informado" });
        }

        const filePath = path.join(audioFolder, fileName);
        const buffer = await fs.readFile(filePath);

        reply.header("Content-Type", "audio/aac");
        return reply.send(buffer);
      } catch (err) {
        console.error("ERRO AO BUSCAR O ÁUDIO:", err);
        return reply.status(404).send({ error: "Arquivo não encontrado" });
      }
    }
  );
}
