import { ContactRepositoryPrisma } from "../repositories/contact-repository";
import {
  Contact,
  ContactCreateInput,
  ContactRepository,
} from "../types/contact-interface";

class ContactUseCase {
  private contactRepository: ContactRepository;
  constructor() {
    this.contactRepository = new ContactRepositoryPrisma();
  }

  async create(
    contact: ContactCreateInput,
    companyId: string
  ): Promise<Contact> {
    return this.contactRepository.create(contact, companyId);
  }

  async findAll(companyId: string): Promise<Contact[]> {
    return this.contactRepository.findAll(companyId);
  }

  async update(
    id: string,
    contact: ContactCreateInput,
    companyId: string
  ): Promise<Contact> {
    return this.contactRepository.update(id, contact, companyId);
  }

  async findById(
    id: string,
    companyId: string
  ): Promise<Contact | null> {
    return this.contactRepository.findById(id, companyId);
  }

  async delete(
    id: string,
    companyId: string
  ): Promise<void> {
    return this.contactRepository.delete(id, companyId);
  }
}

export { ContactUseCase };
