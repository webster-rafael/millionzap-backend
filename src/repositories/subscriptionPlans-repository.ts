import {
  CreateSubscriptionPlan,
  SubscriptionPlan,
  SubscriptionPlanRepository,
} from "../types/subscriptionPlans-interface";
import { prisma } from "../database/prisma-client";

class SubscriptionPlanRepositoryPrisma implements SubscriptionPlanRepository {
  async create(data: CreateSubscriptionPlan): Promise<SubscriptionPlan> {
    const subscriptionPlan = await prisma.subscriptionPlan.create({
      data,
    });
    return {
      ...subscriptionPlan,
      features: subscriptionPlan.features as string[],
    };
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    const subscriptionPlans = await prisma.subscriptionPlan.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    return subscriptionPlans.map((plan) => ({
      ...plan,
      features: plan.features as string[],
    }));
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!subscriptionPlan) {
      return null;
    }

    return {
      ...subscriptionPlan,
      features: subscriptionPlan.features as string[],
    };
  }

  async update(
    id: string,
    data: Partial<CreateSubscriptionPlan>
  ): Promise<SubscriptionPlan> {
    const updatedSubscriptionPlan = await prisma.subscriptionPlan.update({
      where: { id },
      data,
    });

    return {
      ...updatedSubscriptionPlan,
      features: updatedSubscriptionPlan.features as string[],
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.subscriptionPlan.delete({
      where: { id },
    });
  }
}

export { SubscriptionPlanRepositoryPrisma };
