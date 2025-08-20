import { UserRole } from "@prisma/client";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  companyId: string;
  connectionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserCreate {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  companyId: string;
  connectionId?: string | null;
}

export type UserCreateInput = Omit<
  UserCreate,
  "id" | "createdAt" | "updatedAt"
>;

export interface UserRepository {
  create(user: UserCreateInput, companyId: string): Promise<User>;
  findAll(companyId: string): Promise<User[]>;
  update(
    id: string,
    user: Partial<UserCreate>,
    companyId: string
  ): Promise<User>;
  findById(id: string, companyId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: string, companyId: string): Promise<void>;
}
