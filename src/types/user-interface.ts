import { UserRole } from "../generated/prisma-client";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  whatsAppConnectionId: string;
  companyId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  whatsAppConnectionId: string;
}

export type UserCreateInput = Omit<User, "id" | "createdAt" | "updatedAt">;

export interface UserRepository {
  create(user: UserCreateInput): Promise<User>;
  findAll(): Promise<User[]>;
  update(id: string, user: Partial<UserCreate>): Promise<User>;
  findById(id: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}
