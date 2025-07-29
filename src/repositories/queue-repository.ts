import { prisma } from "../database/prisma-client";
import {
  Queue,
  QueueCreate,
  QueueRepository,
  Schedule,
} from "../types/queue-interface";

class QueueRepositoryPrisma implements QueueRepository {
  async create(queue: QueueCreate): Promise<Queue> {
    const createdQueue = await prisma.queue.create({
      data: {
        ...queue,
        schedules: queue.schedules ? queue.schedules.map((s) => s as any) : [],
      },
    });

    return {
      id: createdQueue.id,
      name: createdQueue.name,
      color: createdQueue.color,
      greetingMessage: createdQueue.greetingMessage ?? "",
      outOfOfficeHoursMessage: createdQueue.outOfOfficeHoursMessage ?? "",
      promptId: createdQueue.promptId ?? "",
      integrationId: createdQueue.integrationId ?? "",
      schedules: (createdQueue.schedules as unknown as Schedule[]) ?? [],
      isActive: createdQueue.isActive,
      priority: createdQueue.priority ?? 0,
      createdAt: createdQueue.createdAt,
      updatedAt: createdQueue.updatedAt,
    };
  }

  async findAll(): Promise<Queue[]> {
    const queues = await prisma.queue.findMany();

    return queues.map((queue) => ({
      id: queue.id,
      name: queue.name,
      color: queue.color,
      greetingMessage: queue.greetingMessage ?? "",
      outOfOfficeHoursMessage: queue.outOfOfficeHoursMessage ?? "",
      promptId: queue.promptId ?? "",
      integrationId: queue.integrationId ?? "",
      schedules: (queue.schedules as unknown as Schedule[]) ?? [],
      isActive: queue.isActive,
      priority: queue.priority ?? 0,
      createdAt: queue.createdAt,
      updatedAt: queue.updatedAt,
    }));
  }

  async findById(id: string): Promise<Queue | null> {
    const queue = await prisma.queue.findUnique({
      where: { id },
    });

    return queue ? this.toQueue(queue) : null;
  }

  async update(queue: Queue): Promise<Queue> {
    const updatedQueue = await prisma.queue.update({
      where: { id: queue.id },
      data: {
        ...queue,
        schedules: queue.schedules ? queue.schedules.map((s) => s as any) : [],
      },
    });

    return this.toQueue(updatedQueue);
  }

  async delete(id: string): Promise<void> {
    await prisma.queue.delete({
      where: { id },
    });
  }

  private toQueue = (data: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    color: string;
    greetingMessage: string | null;
    outOfOfficeHoursMessage: string | null;
    promptId: string | null;
    integrationId: string | null;
    isActive: boolean;
    priority: number;
    schedules: any[];
  }): Queue => ({
    id: data.id,
    name: data.name,
    color: data.color,
    greetingMessage: data.greetingMessage ?? "",
    outOfOfficeHoursMessage: data.outOfOfficeHoursMessage ?? "",
    promptId: data.promptId ?? "",
    integrationId: data.integrationId ?? "",
    schedules: (data.schedules as unknown as Schedule[]) ?? [],
    isActive: data.isActive,
    priority: data.priority ?? 0,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  });
}

export { QueueRepositoryPrisma };
