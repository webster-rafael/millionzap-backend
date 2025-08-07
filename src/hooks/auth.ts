import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import "fastify";

interface TokenPayload {
  id: string;
  email: string;
}

declare module "fastify" {
  export interface FastifyRequest {
    company?: TokenPayload;
  }
}

export async function authHook(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ message: "Token não fornecido." });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    request.company = decoded as TokenPayload;
  } catch (error) {
    return reply.status(401).send({ message: "Token inválido." });
  }
}
