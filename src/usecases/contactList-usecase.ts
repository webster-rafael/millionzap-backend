import { ContactListRepository } from "../repositories/contactList-repository";
import {
  ContactList,
  ContactListUpdateInput,
  CreateContactList,
  UpdateContactList,
} from "../types/contactList-interface";

class ContactListUseCase {
  private contactListRepository: ContactListRepository;
  constructor() {
    this.contactListRepository = new ContactListRepository();
  }

  async create(
    contactList: CreateContactList,
    companyId: string
  ): Promise<ContactList> {
    return this.contactListRepository.create(contactList, companyId);
  }

  async findAll(companyId: string): Promise<ContactList[]> {
    return this.contactListRepository.findAll(companyId);
  }

  async findById(id: string, companyId: string): Promise<ContactList | null> {
    return this.contactListRepository.findById(id, companyId);
  }

  async update(
    id: string,
    payload: UpdateContactList,
    companyId: string
  ): Promise<ContactList> {
    const { campaign, contactIds, ...listData } = payload;

    const dataForRepository: ContactListUpdateInput = {
      ...listData,
      contactIds,
    };

    if (campaign) {
      dataForRepository.campaign = {
        upsert: {
          create: campaign,
          update: campaign,
        },
      };
    }

    return this.contactListRepository.update(id, dataForRepository, companyId);
  }

  async delete(id: string, companyId: string): Promise<void> {
    return this.contactListRepository.delete(id, companyId);
  }
}

export { ContactListUseCase };
