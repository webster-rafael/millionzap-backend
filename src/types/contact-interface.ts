export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  whatsappId?: string | null;
  companyId: string;
  isCostumer?: boolean | null;
  tags?: string[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface CreateContact {
  name: string;
  phone: string;
  email?: string | null;
  whatsappId?: string | null;
  isCostumer?: boolean | null;
  tags?: string[];
  companyId: string;
}

export type ContactCreateInput = Omit<
  Contact,
  "id" | "createdAt" | "updatedAt"
>;

export interface ContactRepository {
  create(contact: ContactCreateInput, companyId: string): Promise<Contact>;
  findAll(companyId: string): Promise<Contact[]>;
  update(
    id: string,
    contact: ContactCreateInput,
    companyId: string
  ): Promise<Contact>;
  findById(id: string, companyId: string): Promise<Contact | null>;
  delete(id: string, companyId: string): Promise<void>;
}
