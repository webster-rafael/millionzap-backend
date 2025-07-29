import { QueueRepositoryPrisma } from "../repositories/queue-repository";
import {
  Queue,
  QueueCreate,
  QueueCreateInput,
  QueueRepository,
} from "../types/queue-interface";

class QueueUseCase {
  private queueRepository: QueueRepository;
  constructor() {
    this.queueRepository = new QueueRepositoryPrisma();
  }

  async create(queue: QueueCreate): Promise<Queue> {
    return this.queueRepository.create(queue);
  }

  async findAll(): Promise<Queue[]> {
    return this.queueRepository.findAll();
  }

  async findById(id: string): Promise<Queue | null> {
    return this.queueRepository.findById(id);
  }

  async update(queue: Queue): Promise<Queue> {
    return this.queueRepository.update(queue);
  }

  async delete(id: string): Promise<void> {
    return this.queueRepository.delete(id);
  }
}
export { QueueUseCase };
