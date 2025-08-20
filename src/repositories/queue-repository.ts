import { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma-client";
import { Queue, QueueCreate, QueueRepository } from "../types/queue-interface";

class QueueRepositoryPrisma implements QueueRepository {
  async create(queue: QueueCreate): Promise<Queue> {
    const { promptIds, connections, ...queueData } = queue;

    const createdQueue = await prisma.queue.create({
      data: {
        name: queueData.name,
        companyId: queueData.companyId,
        color: queueData.color ?? "#3B82F6",
        greetingMessage: queueData.greetingMessage ?? null,
        outOfOfficeHoursMessage: queueData.outOfOfficeHoursMessage ?? null,
        integrationId: queueData.integrationId ?? null,
        isActive: queueData.isActive ?? true,
        priority: queueData.priority ?? 0,
        schedules: queueData.schedules
          ? (queueData.schedules.map((s) => ({
              weekday: s.weekday,
              startTime: s.startTime,
              endTime: s.endTime,
              weekdayEn: s.weekdayEn,
            })) as Prisma.InputJsonValue[])
          : [],
      },
      include: {
        prompts: true,
        QueueConnection: true,
      },
    });

    if (promptIds && promptIds.length > 0) {
      await prisma.promptQueue.createMany({
        data: promptIds.map((promptId) => ({
          queueId: createdQueue.id,
          promptId,
        })),
      });
    }

    if (connections && connections.length > 0) {
      await prisma.queueConnection.createMany({
        data: connections.map((connectionId) => ({
          queueId: createdQueue.id,
          connectionId,
        })),
      });
    }

    const finalQueue = await this.findById(
      createdQueue.id,
      createdQueue.companyId
    );
    return this.toQueue(finalQueue);
  }

  async findAll(companyId: string): Promise<Queue[]> {
    const queues = await prisma.queue.findMany({
      where: { companyId },
      include: {
        prompts: true,
        QueueConnection: true,
      },
    });
    return queues.map(this.toQueue);
  }

  async findById(id: string, companyId: string): Promise<Queue | null> {
    const queue = await prisma.queue.findFirst({
      where: { id, companyId },
      include: {
        prompts: true,
        QueueConnection: true,
      },
    });
    return queue ? this.toQueue(queue) : null;
  }

  async update(id: string, data: Partial<QueueCreate>): Promise<Queue> {
    const updatedQueue = await prisma.queue.update({
      where: { id },
      data: {
        name: data.name,
        color: data.color ?? "#3B82F6",
        greetingMessage: data.greetingMessage ?? null,
        outOfOfficeHoursMessage: data.outOfOfficeHoursMessage ?? null,
        integrationId: data.integrationId ?? null,
        isActive: data.isActive ?? true,
        priority: data.priority ?? 0,
        schedules: data.schedules
          ? (data.schedules.map((s) => ({
              weekday: s.weekday,
              startTime: s.startTime,
              endTime: s.endTime,
              weekdayEn: s.weekdayEn,
            })) as Prisma.InputJsonValue[])
          : undefined,
      },
      include: {
        prompts: true,
        QueueConnection: true,
      },
    });

    if (data.promptIds) {
      await prisma.promptQueue.deleteMany({ where: { queueId: id } });
      if (data.promptIds.length > 0) {
        await prisma.promptQueue.createMany({
          data: data.promptIds.map((promptId) => ({
            queueId: id,
            promptId,
          })),
        });
      }
    }

    if (data.connections) {
      await prisma.queueConnection.deleteMany({ where: { queueId: id } });
      if (data.connections.length) {
        await prisma.queueConnection.createMany({
          data: data.connections.map((connectionId) => ({
            queueId: id,
            connectionId,
          })),
        });
      }
    }

    const finalQueue = await this.findById(
      updatedQueue.id,
      updatedQueue.companyId
    );

    return this.toQueue(finalQueue);
  }

  async delete(id: string, companyId: string): Promise<void> {
    await prisma.promptQueue.deleteMany({
      where: { queueId: id },
    });

    await prisma.queueConnection.deleteMany({
      where: { queueId: id },
    });

    await prisma.queueUser.deleteMany({
      where: { queueId: id },
    });

    await prisma.queue.delete({
      where: { id, companyId },
    });
  }

  private toQueue = (queue: any): Queue => ({
    id: queue.id,
    name: queue.name,
    color: queue.color ?? "#3B82F6",
    greetingMessage: queue.greetingMessage ?? "",
    outOfOfficeHoursMessage: queue.outOfOfficeHoursMessage ?? "",
    integrationId: queue.integrationId ?? "",
    isActive: queue.isActive,
    priority: queue.priority ?? 0,
    schedules: queue.schedules ?? [],
    createdAt: queue.createdAt,
    updatedAt: queue.updatedAt,
    companyId: queue.companyId,
    promptIds: queue.prompts?.map((p: any) => p.promptId) ?? [],
    connections: queue.QueueConnection?.map((qc: any) => qc.connectionId) ?? [],
  });
}

export { QueueRepositoryPrisma };
