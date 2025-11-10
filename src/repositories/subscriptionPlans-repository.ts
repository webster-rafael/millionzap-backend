import {
  CreateSubscriptionPlan,
  SubscriptionPlan,
  SubscriptionPlanRepository,
} from "../types/subscriptionPlans-interface";
import { prisma } from "../database/prisma-client";
import { SubscriptionPlan as PrismaSubscriptionPlan } from "@prisma/client";

class SubscriptionPlanRepositoryPrisma implements SubscriptionPlanRepository {
  private formatSubscriptionPlan(
    plan: PrismaSubscriptionPlan
  ): SubscriptionPlan {
    return {
      ...plan,
      features: (plan.features as string[]) ?? [],
      firstMonth: plan.firstMonth ?? false,
      nextMonthsPrice: plan.nextMonthsPrice ?? plan.price,
    };
  }

  async create(data: CreateSubscriptionPlan): Promise<SubscriptionPlan> {
    const subscriptionPlan = await prisma.subscriptionPlan.create({
      data,
    });
    return this.formatSubscriptionPlan(subscriptionPlan);
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    const subscriptionPlans = await prisma.subscriptionPlan.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    return subscriptionPlans.map((plan) => this.formatSubscriptionPlan(plan));
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!subscriptionPlan) {
      return null;
    }

    return this.formatSubscriptionPlan(subscriptionPlan);
  }

  async update(
    id: string,
    data: Partial<CreateSubscriptionPlan>
  ): Promise<SubscriptionPlan> {
    const updatedSubscriptionPlan = await prisma.subscriptionPlan.update({
      where: { id },
      data,
    });

    return this.formatSubscriptionPlan(updatedSubscriptionPlan);
  }

  async delete(id: string): Promise<void> {
    await prisma.subscriptionPlan.delete({
      where: { id },
    });
  }
}

export { SubscriptionPlanRepositoryPrisma };
