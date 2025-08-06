import { prisma } from "../database/prisma-client";
import { Queue, QueueCreate, QueueRepository } from "../types/queue-interface";

class QueueRepositoryPrisma implements QueueRepository {
  async create(queue: QueueCreate): Promise<Queue> {
    const createQueue = await prisma.queue.create({
      data: {
        name: queue.name,
        color: queue.color ?? "",
        greetingMessage: queue.greetingMessage ?? "",
        outOfOfficeHoursMessage: queue.outOfOfficeHoursMessage ?? "",
        promptId: queue.promptId ?? "",
        integrationId: queue.integrationId ?? "",
        isActive: queue.isActive,
        priority: queue.priority ?? 0,
        schedules: queue.schedules
          ? JSON.parse(JSON.stringify(queue.schedules))
          : [],
      },
    });

    return this.toQueue(createQueue);
  }

  async findAll(): Promise<Queue[]> {
    const queues = await prisma.queue.findMany();
    return queues.map(this.toQueue);
  }

  async findById(id: string): Promise<Queue | null> {
    const queue = await prisma.queue.findUnique({ where: { id } });
    return queue ? this.toQueue(queue) : null;
  }

  async update(id: string, data: Partial<QueueCreate>): Promise<Queue> {
    const updateQueue = await prisma.queue.update({
      where: { id },
      data: {
        name: data.name,
        color: data.color ?? "",
        greetingMessage: data.greetingMessage ?? "",
        outOfOfficeHoursMessage: data.outOfOfficeHoursMessage ?? "",
        promptId: data.promptId ?? "",
        integrationId: data.integrationId ?? "",
        isActive: data.isActive ?? true,
        priority: data.priority ?? 0,
        schedules: data.schedules
          ? JSON.parse(JSON.stringify(data.schedules))
          : [],
      },
    });

    return this.toQueue(updateQueue);
  }

  async delete(id: string): Promise<void> {
    await prisma.queue.delete({ where: { id } });
  }

  private toQueue = (queue: any): Queue => ({
    id: queue.id,
    name: queue.name,
    color: queue.color ?? "",
    greetingMessage: queue.greetingMessage ?? "",
    outOfOfficeHoursMessage: queue.outOfOfficeHoursMessage ?? "",
    promptId: queue.promptId ?? "",
    integrationId: queue.integrationId ?? "",
    isActive: queue.isActive,
    priority: queue.priority ?? 0,
    schedules: queue.schedules ?? [],
    createdAt: queue.createdAt,
    updatedAt: queue.updatedAt,
  });
}

export { QueueRepositoryPrisma };
