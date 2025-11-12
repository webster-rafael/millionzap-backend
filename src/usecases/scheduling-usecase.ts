import { SchedulingRepositoryPrisma } from "../repositories/scheduling-repository";
import {
  CreateScheduling,
  Scheduling,
  SchedulingRepository,
} from "../types/scheduling-interface";

class SchedulingUseCase {
  private schedulingRepository: SchedulingRepository;

  constructor() {
    this.schedulingRepository = new SchedulingRepositoryPrisma();
  }

  async create(
    scheduling: CreateScheduling,
    companyId: string
  ): Promise<Scheduling> {
    return this.schedulingRepository.create(scheduling, companyId);
  }

  async findAll(companyId: string): Promise<Scheduling[]> {
    return this.schedulingRepository.findAll(companyId);
  }

  async findById(
    id: string,
    companyId: string
  ): Promise<Scheduling | null> {
    return this.schedulingRepository.findById(id, companyId);
  }

  async update(
    id: string,
    scheduling: Partial<CreateScheduling>,
    companyId: string
  ): Promise<Scheduling> {
    return this.schedulingRepository.update(id, scheduling, companyId);
  }

  async delete(id: string, companyId: string): Promise<void> {
    return this.schedulingRepository.delete(id, companyId);
  }
}

export { SchedulingUseCase };
