import { prisma } from "../database/prisma-client";
import { Contact } from "../types/contact-interface";
import {
  ContactList,
  ContactListCreateInput,
  CreateContactList,
} from "../types/contactList-interface";

class ContactListRepository {
  async create(
    contactListInput: CreateContactList,
    companyId: string
  ): Promise<ContactList> {
    try {
      const { contactIds, ...listData } = contactListInput;

      const createContactList = await prisma.contactList.create({
        data: {
          ...listData,
          companyId: companyId,
          contacts: {
            create: contactIds?.map((contactId) => ({
              contact: { connect: { id: contactId } },
            })),
          },
        },
        include: { contacts: true },
      });
      return this.toContactList(createContactList, companyId);
    } catch (error) {
      throw error;
    }
  }

  async findAll(companyId: string): Promise<ContactList[]> {
    return await prisma.contactList.findMany({
      where: {
        companyId: companyId,
      },
      include: {
        contacts: {
          include: {
            contact: true,
          },
        },
      },
    });
  }

  async findById(id: string, companyId: string): Promise<ContactList | null> {
    return await prisma.contactList.findUnique({
      where: {
        id: id,
        companyId: companyId,
      },
      include: {
        contacts: {
          include: {
            contact: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    payload: {
      name?: string;
      description?: string | null;
      isActive?: boolean;
      contactIds?: string[];
    },
    companyId: string
  ): Promise<ContactList> {
    const { contactIds, ...listData } = payload;

    return await prisma.$transaction(async (tx) => {
      if (Object.keys(listData).length > 0) {
        await tx.contactList.update({
          where: { id: id, companyId: companyId },
          data: listData,
        });
      }

      if (contactIds) {
        await tx.contactListOnContact.deleteMany({
          where: { contactListId: id },
        });

        if (contactIds.length > 0) {
          await tx.contactListOnContact.createMany({
            data: contactIds.map((contactId) => ({
              contactListId: id,
              contactId: contactId,
            })),
          });
        }
      }

      return await tx.contactList.findUniqueOrThrow({
        where: { id },
        include: {
          contacts: {
            include: {
              contact: true,
            },
          },
        },
      });
    });
  }

  async delete(id: string, companyId: string): Promise<void> {
    await prisma.contactList.delete({
      where: {
        id: id,
        companyId: companyId,
      },
    });
  }

  private toContactList = (
    contactList: ContactList,
    companyId: string
  ): ContactList => ({
    id: contactList.id,
    name: contactList.name,
    description: contactList.description ?? "",
    isActive: contactList.isActive,
    createdAt: contactList.createdAt,
    companyId,
    contacts: contactList.contacts ?? [],
  });
}

export { ContactListRepository };
