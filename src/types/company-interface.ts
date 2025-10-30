import { SubscriptionPlan } from "@prisma/client";

export interface InstagramProfile {
  id: string;
  name: string;
  username: string;
  image?: string | null;
  followersCount: number;
  followsCount: number;
  companyId?: string | null;
  userId?: string | null;
}

export interface Company {
  id: string;
  name: string;
  phone: string;
  email: string;
  subscriptionPlanId?: string | null;
  status: boolean;
  dueDate?: Date | null;
  superAdmin?: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  subscriptionPlan?: SubscriptionPlan;
  instagramProfile?: InstagramProfile | null;
}

export interface CreateCompany {
  name: string;
  phone: string;
  email: string;
  password: string;
  superAdmin?: boolean | null;
  subscriptionPlanId?: string | null;
}

export interface CompanyRepository {
  create(company: CreateCompany): Promise<Company>;
  findAll(): Promise<Company[]>;
  findById(id: string): Promise<Company | null>;
  findByEmail(email: string): Promise<Company | null>;
  update(id: string, company: Company): Promise<Company>;
  delete(id: string): Promise<void>;
}
