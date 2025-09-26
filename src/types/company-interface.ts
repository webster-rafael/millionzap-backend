import { SubscriptionPlan } from "@prisma/client";

export interface Company {
  id: string;
  name: string;
  phone: string;
  email: string;
  subscriptionPlanId: string;
  status: boolean;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  subscriptionPlan?: SubscriptionPlan;
}

export interface CreateCompany {
  name: string;
  phone: string;
  email: string;
  password: string;
  subscriptionPlanId: string;
}

export interface CompanyRepository {
  create(company: CreateCompany): Promise<Company>;
  findAll(): Promise<Company[]>;
  findById(id: string): Promise<Company | null>;
  findByEmail(email: string): Promise<Company | null>;
  update(id: string, company: Company): Promise<Company>;
  delete(id: string): Promise<void>;
}
