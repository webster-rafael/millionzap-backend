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

  async create(data: CreateSubscriptionPlan): Promise<SubscriptionPlan> {
    return this.subscriptionPlanRepository.create(data);
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
