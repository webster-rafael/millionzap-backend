import { prisma } from "../database/prisma-client";
import { Prisma } from "@prisma/client";
import {
  Contact,
  ContactRepository,
  CreateContact,
} from "../types/contact-interface";

class ContactRepositoryPrisma implements ContactRepository {
  async create(contact: CreateContact, companyId: string): Promise<Contact> {
    try {
      const createContact = await prisma.contact.create({
        data: {
          ...contact,
          companyId: companyId,
          userId: contact.userId,
        },
      });
      return this.toContact(createContact, companyId);
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

  async findAll(userId: string, companyId: string): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      where: { companyId, userId },
    });
    return contacts.map((contact) => this.toContact(contact, companyId));
  }

  async update(
    id: string,
    contact: Partial<CreateContact>,
    companyId: string
  ): Promise<Contact> {
    const updateContact = await prisma.contact.update({
      where: { id },
      data: contact,
    });
    return this.toContact(updateContact, companyId);
  }

  async findById(id: string, companyId: string): Promise<Contact | null> {
    const contact = await prisma.contact.findUnique({ where: { id } });
    return contact ? this.toContact(contact, companyId) : null;
  }

  async delete(id: string): Promise<void> {
    await prisma.contact.delete({ where: { id } });
  }

  private toContact = (contact: Contact, companyId: string): Contact => ({
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    email: contact.email ?? "",
    userId: contact.userId ?? "",
    companyId,
    whatsappId: contact.whatsappId ?? "",
    isCostumer: contact.isCostumer ?? true,
    tags: contact.tags ?? [],
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt ?? null,
  });
}

export { ContactRepositoryPrisma };
