import { TriggerStatus } from "@prisma/client";
import { Note } from "./note-interface";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  image?: string | null;
  notes?: Note[];
  whatsappId?: string | null;
  companyId: string;
  userId?: string | null;
  isCustomer?: boolean | null;
  triggerStatus?: TriggerStatus | null;
  tags?: string[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface CreateContact {
  name: string;
  phone: string;
  email?: string | null;
  image?: string | null;
  notes?: Note[];
  whatsappId?: string | null;
  userId?: string | null;
  isCustomer?: boolean | null;
  triggerStatus?: TriggerStatus | null;
  tags?: string[];
  companyId: string;
}

export type ContactCreateInput = Omit<
  Contact,
  "id" | "createdAt" | "updatedAt" | "companyId" | "notes"
>;

export interface ContactRepository {
  create(contact: ContactCreateInput, companyId: string): Promise<Contact>;
  findAll(companyId: string): Promise<Contact[]>;
  update(
    id: string,
    contact: Partial<ContactCreateInput>,
    companyId: string
  ): Promise<Contact>;

  findById(id: string, companyId: string): Promise<Contact | null>;
  delete(id: string, companyId: string): Promise<void>;
}
