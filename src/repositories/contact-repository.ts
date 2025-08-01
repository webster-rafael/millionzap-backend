import { prisma } from "../database/prisma-client";
import { Prisma } from "../generated/prisma-client";
import {
  Contact,
  ContactRepository,
  CreateContact,
} from "../types/contact-interface";

class ContactRepositoryPrisma implements ContactRepository {
  async create(contact: CreateContact): Promise<Contact> {
    try {
      const createContact = await prisma.contact.create({ data: contact });
      return this.toContact(createContact);
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const customError = new Error("Telefone já cadastrado.") as Error & {
          code: string;
        };
        customError.code = "P2002";
        throw customError;
      }

      throw error;
    }
  }

  async findAll(): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany();
    return contacts.map(this.toContact);
  }

  async update(id: string, contact: Partial<CreateContact>): Promise<Contact> {
    const updateContact = await prisma.contact.update({
      where: { id },
      data: contact,
    });
    return this.toContact(updateContact);
  }

  async findById(id: string): Promise<Contact | null> {
    const contact = await prisma.contact.findUnique({ where: { id } });
    return contact ? this.toContact(contact) : null;
  }

  async delete(id: string): Promise<void> {
    await prisma.contact.delete({ where: { id } });
  }

  private toContact = (contact: Contact): Contact => ({
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    email: contact.email ?? "",
    companyId: contact.companyId ?? "",
    whatsappId: contact.whatsappId ?? "",
    isCostumer: contact.isCostumer ?? true,
    tags: contact.tags ?? [],
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
  });
}

export { ContactRepositoryPrisma };
