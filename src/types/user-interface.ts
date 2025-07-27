export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = "ADMIN",
  AGENT = "AGENT",
}

export interface UserCreate {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
}

export interface UserRepository {
  create(user: UserCreate): Promise<User>;
}
