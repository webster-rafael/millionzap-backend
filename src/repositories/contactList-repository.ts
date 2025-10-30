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
    const { contactIds, campaign, contactsData = [], ...listData } = payload;

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
          phone: { in: formattedContacts.map((c) => c.phone) },
          companyId,
        },
        select: { id: true },
      });

      newContactIds = foundContacts.map((c) => c.id);
    }

    await prisma.$transaction(
      async (tx) => {
        const existing = await tx.contactList.findUnique({
          where: { id, companyId },
          include: {
            contacts: true,
            campaign: true,
          },
        });

        if (!existing) throw new Error("Lista não encontrada");

        if (campaign) {
          if (existing.campaign) {
            await tx.campaign.update({
              where: { id: existing.campaign.id },
              data: {
                title: campaign.title ?? existing.campaign.title ?? "",
                body: campaign.body ?? existing.campaign.body ?? "",
                imageUrl: campaign.imageUrl ?? existing.campaign.imageUrl ?? "",
                footer: campaign.footer ?? existing.campaign.footer ?? "",
              },
            });
          } else {
            await tx.campaign.create({
              data: {
                title: campaign.title ?? "",
                body: campaign.body ?? "",
                imageUrl: campaign.imageUrl ?? "",
                footer: campaign.footer ?? "",
                contactList: { connect: { id } },
              },
            });
          }
        }

        if (Object.keys(listData).length > 0) {
          await tx.contactList.update({
            where: { id, companyId },
            data: listData,
          });
        }

        if ((contactIds && contactIds.length > 0) || newContactIds.length > 0) {
          const mergedContactIds = Array.from(
            new Set([...(contactIds || []), ...newContactIds])
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
        }
      },
      { timeout: 15000 }
    );

    return prisma.contactList.findUniqueOrThrow({
      where: { id, companyId },
      include: {
        contacts: { include: { contact: true } },
        campaign: true,
      },
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
