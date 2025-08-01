import { prisma } from "../database/prisma-client";
import { Prisma } from "../generated/prisma-client";
import {
  User,
  UserCreate,
  UserCreateInput,
  UserRepository,
} from "../types/user-interface";

class UserRepositoryPrisma implements UserRepository {
  async create(user: UserCreateInput): Promise<User> {
    try {
      const createUser = await prisma.user.create({ data: user });
      return this.toCreateUser(createUser);
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
    const users = await prisma.user.findMany();
    return users.map(this.toCreateUser);
  }

  async update(id: string, user: Partial<UserCreate>): Promise<User> {
    const updateUser = await prisma.user.update({
      where: { id },
      data: user,
    });

    return this.toCreateUser(updateUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? this.toCreateUser(user) : null;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  private toCreateUser = (data: User): User => ({
    id: data.id,
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    isActive: data.isActive,
    whatsAppConnectionId: data.whatsAppConnectionId,
    companyId: data.companyId ?? "",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  });
}

export { UserRepositoryPrisma };
