import { prisma } from "../database/prisma-client";
import {
  CreateScheduling,
  Scheduling,
  SchedulingRepository,
} from "../types/scheduling-interface";

class SchedulingRepositoryPrisma implements SchedulingRepository {
  async create(
    data: CreateScheduling,
    companyId: string
  ): Promise<Scheduling> {
    const scheduling = await prisma.scheduling.create({
      data: {
        ...data,
        companyId,
        reminder: data.reminder ?? false,
      },
    });

    return this.toScheduling(scheduling);
  }

  async findAll(companyId: string): Promise<Scheduling[]> {
    const schedulings = await prisma.scheduling.findMany({
      where: { companyId },
      orderBy: [
        { date: "asc" },
        { time: "asc" },
      ],
    });

    return schedulings.map(this.toScheduling);
  }

  async findById(
    id: string,
    companyId: string
  ): Promise<Scheduling | null> {
    const scheduling = await prisma.scheduling.findFirst({
      where: { id, companyId },
    });

    return scheduling ? this.toScheduling(scheduling) : null;
  }

  async update(
    id: string,
    data: Partial<CreateScheduling>,
    companyId: string
  ): Promise<Scheduling> {
    const updated = await prisma.scheduling.update({
      where: { id },
      data: {
        ...data,
        companyId,
      },
    });

    return this.toScheduling(updated);
  }

  async delete(id: string, companyId: string): Promise<void> {
    await prisma.scheduling.deleteMany({
      where: { id, companyId },
    });
  }

  private toScheduling = (scheduling: any): Scheduling => ({
    id: scheduling.id,
    title: scheduling.title,
    description: scheduling.description ?? null,
    date: scheduling.date,
    time: scheduling.time,
    endTime: scheduling.endTime,
    duration: scheduling.duration ?? null,
    type: scheduling.type,
    status: scheduling.status,
    priority: scheduling.priority,
    companyId: scheduling.companyId ?? null,
    contactId: scheduling.contactId,
    reminder: scheduling.reminder,
    reminderTime: scheduling.reminderTime ?? null,
    createdAt: scheduling.createdAt,
    updatedAt: scheduling.updatedAt,
  });
}

export { SchedulingRepositoryPrisma };
