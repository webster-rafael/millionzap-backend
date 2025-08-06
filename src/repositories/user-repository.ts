import { prisma } from "../database/prisma-client";
import { Prisma } from "../generated/prisma-client";
import {
  User,
  UserCreate,
  UserCreateInput,
  UserRepository,
} from "../types/user-interface";

class UserRepositoryPrisma implements UserRepository {
  async create(data: UserCreate & { queueIds?: string[] }): Promise<User> {
    const { queueIds, ...userData } = data;
    try {
      const createdUser = await prisma.user.create({
        data: {
          ...userData,
          queues: {
            create: queueIds?.map((queueId) => ({
              queue: {
                connect: { id: queueId },
              },
            })),
          },
        },
        include: {
          queues: { include: { queue: true } },
        },
      });
      return createdUser;
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const customError = new Error("Telefone já cadastrado.") as Error & {
          code: string;
        };
        customError.code = "P2002";
        throw customError;
      }

      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      include: {
        queues: {
          include: {
            queue: true,
          },
        },
      },
    });
    return users;
  }

  async update(
    id: string,
    user: Partial<UserCreate & { queueIds?: string[]; queues?: any[] }>
  ): Promise<User> {
    const { queueIds, queues, ...userData } = user;

    const transactionResult = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: userData,
      });

      if (Array.isArray(queueIds)) {
        await tx.queueUser.deleteMany({
          where: { userId: id },
        });
        if (queueIds.length > 0) {
          await tx.queueUser.createMany({
            data: queueIds.map((queueId: string) => ({
              userId: id,
              queueId: queueId,
            })),
          });
        }
      }
      const result = await tx.user.findUniqueOrThrow({
        where: { id },
        include: {
          queues: {
            include: {
              queue: true,
            },
          },
        },
      });

      return result;
    });

    return transactionResult;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        queues: {
          include: {
            queue: true,
          },
        },
      },
    });

    return user;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}

export { UserRepositoryPrisma };
