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

const getTokenFromHeader = (authHeader?: string) => {
  if (!authHeader) return null;
  const [scheme, value] = authHeader.split(" ");
  if (scheme !== "Bearer" || !value) return null;
  return value;
};

const getTokenFromCookieHeader = (cookieHeader?: string | string[]) => {
  if (!cookieHeader) return null;
  const headerValue = Array.isArray(cookieHeader)
    ? cookieHeader.join(";")
    : cookieHeader;

  return headerValue
    .split(";")
    .map((part) => part.trim())
    .map((part) => part.split("="))
    .find(([name]) => name === "authToken")?.[1] ?? null;
};

export async function authHook(request: FastifyRequest, reply: FastifyReply) {
  const cookieToken =
    request.cookies?.authToken ??
    getTokenFromCookieHeader(request.headers.cookie);
  const headerToken = getTokenFromHeader(request.headers.authorization);
  const token = cookieToken ?? headerToken;

  if (!token) {
    return reply
      .status(401)
      .send({ message: "Token de autenticação não fornecido." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return reply
        .status(401)
        .send({ message: "Usuário não encontrado ou token revogado." });
    }

    const { password: _password, ...loggedUser } = user;
    request.user = loggedUser;
  } catch {
    return reply.status(401).send({ message: "Token inválido ou expirado." });
  }
}
