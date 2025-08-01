export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  whatsappId?: string | null;
  companyId?: string | null;
  isCostumer?: boolean | null;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContact {
  name: string;
  phone: string;
  email?: string | null;
  whatsappId?: string | null;
  isCostumer?: boolean | null;
  tags?: string[];
}

export type ContactCreateInput = Omit<
  Contact,
  "id" | "createdAt" | "updatedAt"
>;

export interface ContactRepository {
  create(contact: ContactCreateInput): Promise<Contact>;
  findAll(): Promise<Contact[]>;
  update(id: string, contact: CreateContact): Promise<Contact>;
  findById(id: string): Promise<Contact | null>;
  delete(id: string): Promise<void>;
}
