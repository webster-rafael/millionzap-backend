import { Priority, StatusScheduling } from "@prisma/client";

export interface Scheduling {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  time: string;
  endTime: string;
  duration?: number | null;
  type: string;
  status: StatusScheduling;
  priority: Priority;
  companyId?: string | null;
  contactId: string;
  reminder: boolean;
  reminderTime?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateScheduling {
  title: string;
  description?: string | null;
  date: string;
  time: string;
  endTime: string;
  duration?: number | null;
  type: string;
  status: StatusScheduling;
  priority: Priority;
  companyId?: string | null;
  contactId: string;
  reminder?: boolean;
  reminderTime?: string | null;
}

export interface SchedulingRepository {
  create(data: CreateScheduling, companyId: string): Promise<Scheduling>;
  findAll(companyId: string): Promise<Scheduling[]>;
  findById(id: string, companyId: string): Promise<Scheduling | null>;
  update(
    id: string,
    data: Partial<CreateScheduling>,
    companyId: string
  ): Promise<Scheduling>;
  delete(id: string, companyId: string): Promise<void>;
}
