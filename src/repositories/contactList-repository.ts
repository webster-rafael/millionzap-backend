import { prisma } from "../database/prisma-client";
import { Contact } from "../types/contact-interface";
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
        campaign: true,
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
        campaign: true,
      },
    });
  }

  async update(
    id: string,
    payload: ContactListUpdateInput,
    companyId: string
  ): Promise<ContactList> {
    const { contactIds, campaign, ...listData } = payload;

    return await prisma.$transaction(async (tx) => {
      if (Object.keys(listData).length > 0) {
        await tx.contactList.update({
          where: { id: id, companyId: companyId },
          data: {
            ...listData,
            ...(campaign && {
              campaign: {
                upsert: {
                  create: campaign.upsert.create,
                  update: campaign.upsert.update,
                },
              },
            }),
          },
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
          contacts: { include: { contact: true } },
          campaign: true,
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
    campaign: contactList.campaign ?? null,
  });
}

export { ContactListRepository };
