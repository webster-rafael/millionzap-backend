import { prisma } from "../database/prisma-client";
import {
  User,
  UserCreate,
  UserRepository,
  UserRole,
} from "../types/user-interface";

class UserRepositoryPrisma implements UserRepository {
  async create(data: UserCreate): Promise<User> {
    const user = await prisma.user.create({ data });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: user.role as UserRole,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export { UserRepositoryPrisma };
