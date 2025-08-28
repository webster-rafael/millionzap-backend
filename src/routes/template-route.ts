import { FastifyInstance } from "fastify";
import fsPromises from "fs/promises";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { randomUUID } from "crypto";

export async function templateImageRoutes(fastify: FastifyInstance) {
  const uploadFolder = path.resolve(process.cwd(), "uploads", "templates");

  try {
    await fsPromises.mkdir(uploadFolder, { recursive: true });
  } catch (err) {
    console.error(
      "ERRO CRÍTICO ao criar a pasta de uploads de templates:",
      err
    );
  }

  fastify.post("/upload", async (request, reply) => {
    try {
      const data = await request.file();

      if (!data) {
        return reply.status(400).send({ error: "Nenhum arquivo enviado." });
      }

      const mimeTypeRegex = /^(image)\/[a-zA-Z]+/;
      if (!mimeTypeRegex.test(data.mimetype)) {
        return reply.status(400).send({
          error: "Tipo de arquivo inválido. Apenas imagens são permitidas.",
        });
      }

      const fileExtension = path.extname(data.filename);
      const uniqueFileName = `${randomUUID()}${fileExtension}`;

      const filePath = path.join(uploadFolder, uniqueFileName);
      await pipeline(data.file, fs.createWriteStream(filePath));

      const publicUrl = `${process.env.BACKEND_URL}/uploads/templates/${uniqueFileName}`;

      return reply.status(201).send({
        message: "Imagem do template salva com sucesso",
        url: publicUrl,
      });
    } catch (err) {
      console.error("ERRO AO SALVAR A IMAGEM DO TEMPLATE:", err);
      return reply
        .status(500)
        .send({ error: "Erro interno ao salvar a imagem do template" });
    }
  });
}
