import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { prisma } from "../database/prisma-client";
import "fastify";
interface TokenPayload {
  id: string;
}
declare module "fastify" {
  export interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      name: string;
      companyId: string;
    };
  }
}

export async function authHook(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies.authToken;

  if (!token) {
    return reply
      .status(401)
      .send({ message: "Token de autenticação não fornecido." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return reply
        .status(401)
        .send({ message: "Usuário não encontrado ou token revogado." });
    }

    const { password: _, ...loggedUser } = user;
    request.user = loggedUser;
  } catch (error) {
    return reply.status(401).send({ message: "Token inválido ou expirado." });
  }
}
