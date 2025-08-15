import { FastifyInstance } from "fastify";
import fs from "fs/promises";
import path from "path";
import { apiKeyAuthHook } from "../hooks/apiKeyN8n.js";
import { authHook } from "../hooks/auth.js";

export async function photoRoutes(fastify: FastifyInstance) {
  const photoFolder = path.resolve(process.cwd(), "uploads", "photos");

  try {
    await fs.mkdir(photoFolder, { recursive: true });
  } catch (err) {
    console.error("ERRO CRÍTICO ao criar a pasta de fotos:", err);
  }

  fastify.post<{ Body: { fileName: string; data: string; mimeType: string } }>(
    "/save",
    { onRequest: [apiKeyAuthHook] },
    async (request, reply) => {
      try {
        const { fileName, data, mimeType } = request.body;

        if (!fileName || !data || !mimeType) {
          return reply
            .status(400)
            .send({ error: "fileName, data e mimeType são obrigatórios" });
        }

        const buffer = Buffer.from(data, "base64");
        const filePath = path.join(photoFolder, fileName);
        await fs.writeFile(filePath, buffer);
        const publicUrl = `${process.env.BACKEND_URL}/uploads/photos/${fileName}`;

        return reply.status(201).send({
          message: "Foto salva com sucesso",
          url: publicUrl,
        });
      } catch (err) {
        console.error("ERRO AO SALVAR A FOTO:", err);
        return reply
          .status(500)
          .send({ error: "Erro interno ao salvar a foto" });
      }
    }
  );

  fastify.get<{ Querystring: { fileName: string } }>(
    "/",
    { onRequest: [authHook] },
    async (request, reply) => {
      try {
        const { fileName } = request.query;

        if (!fileName) {
          return reply
            .status(400)
            .send({ error: "Nome do arquivo não informado" });
        }

        const filePath = path.join(photoFolder, fileName);
        const buffer = await fs.readFile(filePath);

        const ext = path.extname(fileName).toLowerCase();
        let contentType = "image/jpeg";
        if (ext === ".png") contentType = "image/png";
        else if (ext === ".webp") contentType = "image/webp";
        else if (ext === ".gif") contentType = "image/gif";

        reply.header("Content-Type", contentType);
        return reply.send(buffer);
      } catch (err) {
        console.error("ERRO AO BUSCAR A FOTO:", err);
        return reply.status(404).send({ error: "Arquivo não encontrado" });
      }
    }
  );
}
