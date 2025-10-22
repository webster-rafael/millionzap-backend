import { prisma } from "../database/prisma-client";
import {
  ContactList,
  ContactListCreateInput,
  ContactListUpdateInput,
  CreateContactList,
} from "../types/contactList-interface";

class ContactListRepository {
  async create(
    contactListInput: CreateContactList,
    companyId: string
  ): Promise<ContactList> {
    try {
      const { contactIds, campaign, ...listData } = contactListInput;

      const createData: any = {
        ...listData,
        companyId: companyId,
        contacts: {
          create: contactIds?.map((contactId) => ({
            contact: { connect: { id: contactId } },
          })),
        },
      };

      if (campaign) {
        createData.campaign = {
          create: campaign,
        };
      }

      const createdContactList = await prisma.contactList.create({
        data: createData,
        include: {
          contacts: { include: { contact: true } },
          campaign: true,
        },
      });

      return this.toContactList(createdContactList, companyId);
    } catch (error) {
      throw error;
    }
  }

  async findAll(companyId: string): Promise<ContactList[]> {
    return prisma.contactList.findMany({
      where: { companyId },
      include: {
        contacts: { include: { contact: true } },
        campaign: true,
      },
    });
  }

  async findById(id: string, companyId: string): Promise<ContactList | null> {
    return prisma.contactList.findUnique({
      where: { id, companyId },
      include: {
        contacts: { include: { contact: true } },
        campaign: true,
      },
    });
  }

  async update(
    id: string,
    payload: ContactListUpdateInput & {
      contactsData?: { id?: string; name: string; phone: string }[];
    },
    companyId: string
  ): Promise<ContactList> {
    const {
      contactIds = [],
      campaign,
      contactsData = [],
      ...listData
    } = payload;

    let newContactIds: string[] = [];

    if (contactsData.length > 0) {
      const formattedContacts = contactsData.map((c) => ({
        ...c,
        phone: c.phone.replace(/\D/g, ""),
      }));

      await prisma.contact.createMany({
        data: formattedContacts.map((c) => ({
          name: c.name,
          phone: c.phone,
          companyId,
        })),
        skipDuplicates: true,
      });

      const foundContacts = await prisma.contact.findMany({
        where: {
          phone: {
            in: formattedContacts.map((c) => c.phone),
          },
          companyId,
        },
        select: { id: true },
      });

      newContactIds = foundContacts.map((c) => c.id);
    }

    return prisma.$transaction(async (tx) => {
      if (Object.keys(listData).length > 0 || campaign) {
        const campaignData = campaign
          ? {
              campaign: {
          upsert: {
            create: campaign as any,
            update: campaign as any,
          },
              },
            }
          : {};

        await tx.contactList.update({
          where: { id, companyId },
          data: {
            ...listData,
            ...campaignData,
          },
        });
      }

      const mergedContactIds = Array.from(
        new Set([...contactIds, ...newContactIds])
      );

      await tx.contactListOnContact.deleteMany({
        where: { contactListId: id },
      });

      if (mergedContactIds.length > 0) {
        await tx.contactListOnContact.createMany({
          data: mergedContactIds.map((contactId) => ({
            contactListId: id,
            contactId,
          })),
        });
      }

      return tx.contactList.findUniqueOrThrow({
        where: { id },
        include: {
          contacts: { include: { contact: true } },
          campaign: true,
        },
      });
    });
  }

  async delete(id: string, companyId: string): Promise<void> {
    await prisma.contactList.delete({
      where: { id, companyId },
    });
  }

  private toContactList(
    contactList: ContactList,
    companyId: string
  ): ContactList {
    return {
      id: contactList.id,
      name: contactList.name,
      description: contactList.description ?? "",
      isActive: contactList.isActive,
      createdAt: contactList.createdAt,
      companyId,
      contacts: contactList.contacts ?? [],
      campaign: contactList.campaign ?? null,
    };
  }
}

export { ContactListRepository };
