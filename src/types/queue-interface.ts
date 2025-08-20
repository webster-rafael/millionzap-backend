export interface Schedule {
  weekday: string;
  startTime: string;
  endTime: string;
  weekdayEn: string;
}

export interface Queue {
  id: string;
  name: string;
  color?: string | null;
  greetingMessage?: string | null;
  outOfOfficeHoursMessage?: string | null;
  integrationId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  priority?: number | null;
  schedules: Schedule[];
  companyId: string;
  promptIds?: string[];
  connections?: string[];
}

export interface QueueCreate {
  name: string;
  color?: string | null;
  greetingMessage?: string | null;
  outOfOfficeHoursMessage?: string | null;
  integrationId?: string | null;
  isActive: boolean;
  priority?: number | null;
  schedules?: Schedule[];
  companyId: string;
  promptIds?: string[];
  connections?: string[];
}

export type QueueCreateInput = Omit<Queue, "id" | "createdAt" | "updatedAt">;

export interface QueueRepository {
  create(queue: QueueCreate): Promise<Queue>;
  findAll(companyId: string): Promise<Queue[]>;
  update(id: string, queue: Partial<QueueCreate>): Promise<Queue>;
  findById(id: string, companyId: string): Promise<Queue | null>;
  delete(id: string, companyId: string): Promise<void>;
}
