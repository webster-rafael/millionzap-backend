export interface Queue {
  id: string;
  name: string;
  color?: string | null;
  greetingMessage?: string | null;
  outOfOfficeHoursMessage?: string | null;
  promptId?: string | null;
  integrationId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  priority?: number | null;
  schedules: Schedule[];
  companyId: string;
}

export interface QueueCreate {
  name: string;
  color?: string | null;
  greetingMessage?: string | null;
  outOfOfficeHoursMessage?: string | null;
  promptId?: string | null;
  integrationId?: string | null;
  isActive: boolean;
  priority?: number | null;
  schedules?: Schedule[];
  companyId: string;
}

export interface Schedule {
  weekday: string;
  startTime: string;
  endTime: string;
  weekdayEn: string;
}

export type QueueCreateInput = Omit<Queue, "id" | "createdAt" | "updatedAt">;

export interface QueueRepository {
  create(queue: QueueCreate): Promise<Queue>;
  findAll(): Promise<Queue[]>;
  update(id: string, queue: Queue): Promise<Queue>;
  findById(id: string): Promise<Queue | null>;
  delete(id: string): Promise<void>;
}
