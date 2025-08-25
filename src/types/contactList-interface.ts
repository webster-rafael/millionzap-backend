import { ContactListOnContact } from "@prisma/client";

export interface ContactList {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  companyId: string;
  updatedAt?: Date | null;
  contacts: ContactListOnContact[];
}

export interface CreateContactList {
  name: string;
  description?: string | null;
  isActive: boolean;
  companyId: string;
  contactIds: string[];
}

export type ContactListCreateInput = Omit<
  ContactList,
  "id" | "createdAt" | "updatedAt" | "contacts"
> & {
  contacts?: {
    createMany: {
      data: { contactId: string }[];
    };
  };
  contactIds?: string[];
};

export interface ContactListRepository {
  create(
    contactList: ContactListCreateInput,
    companyId: string
  ): Promise<ContactList>;
  findAll(companyId: string): Promise<ContactList[]>;
  findById(id: string, companyId: string): Promise<ContactList | null>;
  update(id: string, contactList: ContactListCreateInput): Promise<ContactList>;
  delete(id: string, companyId: string): Promise<void>;
}
