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

  async create(contact: ContactCreateInput): Promise<Contact> {
    return this.contactRepository.create(contact);
  }

  async findAll(): Promise<Contact[]> {
    return this.contactRepository.findAll();
  }

  async update(id: string, contact: Contact): Promise<Contact> {
    return this.contactRepository.update(id, contact);
  }

  async findById(id: string): Promise<Contact | null> {
    return this.contactRepository.findById(id);
  }

  async delete(id: string): Promise<void> {
    return this.contactRepository.delete(id);
  }
}

export { ContactUseCase };
