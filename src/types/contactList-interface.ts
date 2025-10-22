import { Campaign, ContactListOnContact } from "@prisma/client";
export interface CampaignDataInput {
  title?: string | null;
  body: string;
  imageUrl?: string | null;
  footer?: string | null;
}
export interface ContactList {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
  companyId: string;
  contacts: ContactListOnContact[];
  campaign?: Campaign | null;
}
export interface CreateContactList {
  name: string;
  description?: string | null;
  isActive: boolean;
  companyId: string;
  contactIds: string[];
  campaign?: CampaignDataInput;
}

export type ContactListCreateInput = Omit<
  ContactList,
  "id" | "createdAt" | "updatedAt" | "contacts"
> & {
  contactIds?: string[];
  campaign?: {
    create: CampaignDataInput;
  };
};
export interface ContactListUpdateInput {
  name?: string;
  description?: string | null;
  isActive?: boolean;
  contactIds?: string[];
  campaign?: CampaignDataInput;
  contactsData?: {
    id?: string;
    name: string;
    phone: string;
  }[];
}

export interface UpdateContactList {
  name?: string;
  description?: string | null;
  isActive?: boolean;
  contactIds?: string[];
  campaign?: CampaignDataInput;
  contactsData?: {
    id?: string;
    name: string;
    phone: string;
  }[];
}
export interface ContactListRepository {
  create(
    contactList: ContactListCreateInput,
    companyId: string
  ): Promise<ContactList>;

  findAll(companyId: string): Promise<ContactList[]>;

  findById(id: string, companyId: string): Promise<ContactList | null>;

  update(
    id: string,
    data: ContactListUpdateInput,
    companyId: string
  ): Promise<ContactList>;

  delete(id: string, companyId: string): Promise<void>;
}
