import { SubscriptionPlanRepositoryPrisma } from "../repositories/subscriptionPlans-repository";
import {
  CreateSubscriptionPlan,
  SubscriptionPlan,
  SubscriptionPlanRepository,
} from "../types/subscriptionPlans-interface";

class SubscriptionPlanUseCase {
  private subscriptionPlanRepository: SubscriptionPlanRepository;

  constructor() {
    this.subscriptionPlanRepository = new SubscriptionPlanRepositoryPrisma();
  }

  private applyDefaultValues(
    data: CreateSubscriptionPlan
  ): CreateSubscriptionPlan {
    return {
      ...data,
      firstMonth: data.firstMonth ?? false,
      nextMonthsPrice: data.nextMonthsPrice ?? data.price,
    };
  }

  async create(data: CreateSubscriptionPlan): Promise<SubscriptionPlan> {
    const payload = this.applyDefaultValues(data);
    return this.subscriptionPlanRepository.create(payload);
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlanRepository.findAll();
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    return this.subscriptionPlanRepository.findById(id);
  }

  async update(
    id: string,
    data: Partial<CreateSubscriptionPlan>
  ): Promise<SubscriptionPlan> {
    const planExists = await this.subscriptionPlanRepository.findById(id);

    if (!planExists) {
      throw new Error("Plano não encontrado para atualização.");
    }

    return this.subscriptionPlanRepository.update(id, data);
  }
  async delete(id: string): Promise<void> {
    const planExists = await this.subscriptionPlanRepository.findById(id);

    if (!planExists) {
      throw new Error("Plano não encontrado para deleção.");
    }

    return this.subscriptionPlanRepository.delete(id);
  }
}

export { SubscriptionPlanUseCase };
