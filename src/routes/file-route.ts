import { FastifyInstance } from "fastify";
import fs from "fs/promises";
import path from "path";

export async function filesRoutes(fastify: FastifyInstance) {
  const filesFolder = path.resolve(process.cwd(), "uploads", "files");

  try {
    await fs.mkdir(filesFolder, { recursive: true });
  } catch (err) {
    console.error("ERRO CRÍTICO ao criar a pasta de arquivos:", err);
  }

  fastify.post<{ Body: { fileName: string; data: string; mimeType?: string } }>(
    "/save",
    async (request, reply) => {
      try {
        const { fileName, data, mimeType } = request.body;

        if (!fileName || !data) {
          return reply
            .status(400)
            .send({ error: "fileName e data são obrigatórios" });
        }

        const buffer = Buffer.from(data, "base64");
        const filePath = path.join(filesFolder, fileName);

        await fs.writeFile(filePath, buffer);

        const publicUrl = `${process.env.BACKEND_URL}/uploads/files/${fileName}`;

        return reply.status(201).send({
          message: "Arquivo salvo com sucesso",
          url: publicUrl,
          mimeType: mimeType || "application/octet-stream",
        });
      } catch (err) {
        console.error("ERRO AO SALVAR O ARQUIVO:", err);
        return reply
          .status(500)
          .send({ error: "Erro interno ao salvar o arquivo" });
      }
    }
  );

  fastify.get<{ Querystring: { fileName: string } }>(
    "/",
    async (request, reply) => {
      try {
        const { fileName } = request.query;

        if (!fileName) {
          return reply
            .status(400)
            .send({ error: "Nome do arquivo não informado" });
        }

        const filePath = path.join(filesFolder, fileName);

        let contentType = "application/octet-stream";
        if (fileName.endsWith(".pdf")) contentType = "application/pdf";
        else if (fileName.endsWith(".docx"))
          contentType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        else if (fileName.endsWith(".xlsx"))
          contentType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        else if (fileName.endsWith(".txt")) contentType = "text/plain";

        const buffer = await fs.readFile(filePath);
        reply.header("Content-Type", contentType);
        return reply.send(buffer);
      } catch (err) {
        console.error("ERRO AO BUSCAR O ARQUIVO:", err);
        return reply.status(404).send({ error: "Arquivo não encontrado" });
      }
    }
  );

  fastify.post<{ Querystring: { fileName: string } }>(
    "/upload/raw",
    async (request, reply) => {
      try {
        const { fileName } = request.query;

        if (!fileName) {
          return reply
            .status(400)
            .send({ error: "O parâmetro 'fileName' é obrigatório na URL." });
        }

        const fileBuffer = request.body;
        if (!fileBuffer || (fileBuffer as Buffer).length === 0) {
          return reply
            .status(400)
            .send({ error: "Corpo da requisição (arquivo) está vazio." });
        }

        const filePath = path.join(filesFolder, fileName);

        await fs.writeFile(filePath, fileBuffer as Buffer);

        const publicUrl = `${process.env.BACKEND_URL}/uploads/files/${fileName}`;

        return reply.status(201).send({
          message: "Arquivo salvo com sucesso via upload direto",
          url: publicUrl,
        });
      } catch (err) {
        console.error("ERRO AO SALVAR O ARQUIVO (UPLOAD DIRETO):", err);
        return reply
          .status(500)
          .send({ error: "Erro interno ao salvar o arquivo" });
      }
    }
  );
}
