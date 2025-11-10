import { Company, PlanStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: Decimal;
  features: string[];
  status: PlanStatus;
  firstMonth?: boolean | null;
  nextMonthsPrice?: Decimal | null;
  checkoutUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  companies?: Company[];
}

export interface CreateSubscriptionPlan {
  name: string;
  price: Decimal;
  features: string[];
  description?: string | null;
  status?: PlanStatus;
  firstMonth?: boolean | null;
  nextMonthsPrice?: Decimal | null;
  checkoutUrl?: string | null;
}

export interface SubscriptionPlanRepository {
  create(data: CreateSubscriptionPlan): Promise<SubscriptionPlan>;
  findAll(): Promise<SubscriptionPlan[]>;
  findById(id: string): Promise<SubscriptionPlan | null>;
  update(
    id: string,
    data: Partial<CreateSubscriptionPlan>
  ): Promise<SubscriptionPlan>;
  delete(id: string): Promise<void>;
}
