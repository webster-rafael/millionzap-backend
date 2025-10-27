import { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma-client";
import {
  User,
  UserCreate,
  UserCreateInput,
  UserRepository,
} from "../types/user-interface";
import bcrypt from "bcryptjs";

class UserRepositoryPrisma implements UserRepository {
  async create(
    data: UserCreate & { queueIds?: string[] },
    companyId: string
  ): Promise<User> {
    const { queueIds, ...userData } = data;
    try {
      const createdUser = await prisma.user.create({
        data: {
          ...userData,
          companyId,
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

  async findAll(companyId: string): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: {
        companyId,
      },
      include: {
        queues: {
          include: {
            queue: true,
          },
        },
        instagramProfile: true,
      },
    });
    return users;
  }

  async update(
    id: string,
    user: Partial<
      UserCreateInput & {
        queueIds?: string[];
        queues?: any[];
        companyId?: string;
      }
    >
  ): Promise<User> {
    const { queueIds, queues, companyId, ...userData } = user;

    const transactionResult = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id },
        data: userData,
      });

      if (updatedUser.role === "OWNER") {
        await tx.company.update({
          where: { id: updatedUser.companyId },
          data: {
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
          },
        });
      }

      if (Array.isArray(queueIds)) {
        await tx.queueUser.deleteMany({
          where: { userId: id },
        });

        if (queueIds.length > 0) {
          await tx.queueUser.createMany({
            data: queueIds.map((queueId: string) => ({
              userId: id,
              queueId,
            })),
          });
        }
      }

      const result = await tx.user.findUniqueOrThrow({
        where: { id },
        include: {
          queues: { include: { queue: true } },
        },
      });

      return result;
    });

    return transactionResult;
  }

  async findById(id: string, companyId: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { id, companyId },
      include: {
        queues: { include: { queue: true } },
        company: { include: { SubscriptionPlan: true } },
        instagramProfile: true,
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async resetPasswordByCompany(
    companyId: string,
    newPassword: string
  ): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.updateMany({
      where: { companyId },
      data: { password: hashedPassword },
    });
  }

  async delete(id: string, companyId: string): Promise<void> {
    await prisma.user.delete({
      where: { id, companyId },
    });
  }
}

export { UserRepositoryPrisma };
