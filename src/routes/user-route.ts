import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecases/user-usecase";
import { UserCreate } from "../types/user-interface";

export async function userRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase();
  fastify.post<{ Body: UserCreate }>("/", async (request, reply) => {
    const { name, email, password, phone, role } = request.body;
    try {
      const data = await userUseCase.create({
        name,
        email,
        password,
        phone,
        role,
      });
      reply.status(201).send(data);
    } catch (error) {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}
