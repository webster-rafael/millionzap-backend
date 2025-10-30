import { prisma } from "../database/prisma-client";
import {
  ConfigurationRepository,
  Configuration,
} from "../types/configuration-interface";
import { InputJsonValue } from "@prisma/client/runtime/library";

import { BusinessHours } from "../types/configuration-interface";

function sortBusinessHours(businessHours: any): BusinessHours {
  if (!businessHours) {
    return {
      domingo: { closed: true },
      segunda: { closed: false, open: "07:00", close: "17:30" },
      terca: { closed: false, open: "07:00", close: "17:30" },
      quarta: { closed: false, open: "07:00", close: "17:30" },
      quinta: { closed: false, open: "07:00", close: "17:30" },
      sexta: { closed: false, open: "07:00", close: "17:30" },
      sabado: { closed: true },
    };
  }

  const order = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo",
  ];

  return Object.fromEntries(
    order
      .filter((day) => businessHours.hasOwnProperty(day))
      .map((day) => [day, businessHours[day]])
  ) as BusinessHours;
}

class ConfigurationRepositoryPrisma implements ConfigurationRepository {
  async create(data: Configuration, companyId: string): Promise<Configuration> {
    const defaultBusinessHours = {
      domingo: { closed: true },
      segunda: { closed: false, open: "07:00", close: "17:30" },
      terca: { closed: false, open: "07:00", close: "17:30" },
      quarta: { closed: false, open: "07:00", close: "17:30" },
      quinta: { closed: false, open: "07:00", close: "17:30" },
      sexta: { closed: false, open: "07:00", close: "17:30" },
      sabado: { closed: true },
    };

    const order = [
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
      "domingo",
    ];

    const businessHoursToSave =
      data.businessHours && Object.keys(data.businessHours).length > 0
        ? Object.fromEntries(
            order
              .map((key) => [key, (data.businessHours as any)?.[key]])
              .filter(([_, v]) => v !== undefined)
          )
        : defaultBusinessHours;

    const created = await prisma.configuration.create({
      data: {
        followupTimeInHours: data.followupTimeInHours,
        companyId,
        businessHours: businessHoursToSave as InputJsonValue,
        clientIdInstagram: data.clientIdInstagram ?? "",
        clientSecretInstagram: data.clientSecretInstagram ?? "",
        appIdInstagram: data.appIdInstagram ?? "",
        tokenInstagram: data.tokenInstagram ?? "",
      },
    });

    return {
      id: created.id,
      companyId: created.companyId,
      followupTimeInHours: created.followupTimeInHours,
      businessHours: sortBusinessHours(created.businessHours as any),
      clientIdInstagram: created.clientIdInstagram ?? null,
      clientSecretInstagram: created.clientSecretInstagram ?? null,
      appIdInstagram: created.appIdInstagram ?? null,
      tokenInstagram: created.tokenInstagram ?? null,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  async findAll(companyId: string): Promise<Configuration[]> {
    const results = await prisma.configuration.findMany({
      where: { companyId },
    });

    return results.map((c) => ({
      id: c.id,
      companyId: c.companyId,
      followupTimeInHours: c.followupTimeInHours,
      businessHours: sortBusinessHours(c.businessHours as any),
      clientIdInstagram: c.clientIdInstagram,
      clientSecretInstagram: c.clientSecretInstagram,
      appIdInstagram: c.appIdInstagram,
      tokenInstagram: c.tokenInstagram,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }

  async findById(id: string, companyId: string): Promise<Configuration | null> {
    const c = await prisma.configuration.findFirst({
      where: { id, companyId },
    });

    if (!c) return null;

    return {
      id: c.id,
      companyId: c.companyId,
      followupTimeInHours: c.followupTimeInHours,
      businessHours: sortBusinessHours(c.businessHours as any),
      clientIdInstagram: c.clientIdInstagram,
      clientSecretInstagram: c.clientSecretInstagram,
      appIdInstagram: c.appIdInstagram,
      tokenInstagram: c.tokenInstagram,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }

  async update(
    id: string,
    data: Partial<Configuration>,
    companyId: string
  ): Promise<Configuration | null> {
    const order = [
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
      "domingo",
    ];

    const businessHoursToSave =
      data.businessHours && Object.keys(data.businessHours).length > 0
        ? Object.fromEntries(
            order
              .map((key) => [key, (data.businessHours as any)?.[key]])
              .filter(([_, v]) => v !== undefined)
          )
        : data.businessHours;

    const updateData: {
      followupTimeInHours?: number;
      businessHours?: InputJsonValue;
      clientIdInstagram?: string | null;
      clientSecretInstagram?: string | null;
      appIdInstagram?: string | null;
      tokenInstagram?: string | null;
    } = {};

    if (data.followupTimeInHours !== undefined) {
      updateData.followupTimeInHours = data.followupTimeInHours;
    }

    if (businessHoursToSave !== undefined) {
      updateData.businessHours = businessHoursToSave as InputJsonValue;
    }

    if (data.clientIdInstagram !== undefined) {
      updateData.clientIdInstagram = data.clientIdInstagram ?? null;
    }

    if (data.clientSecretInstagram !== undefined) {
      updateData.clientSecretInstagram = data.clientSecretInstagram ?? null;
    }

    if (data.appIdInstagram !== undefined) {
      updateData.appIdInstagram = data.appIdInstagram ?? null;
    }

    if (data.tokenInstagram !== undefined) {
      updateData.tokenInstagram = data.tokenInstagram ?? null;
    }

    const updated = await prisma.configuration.update({
      where: { id },
      data: updateData,
    });

    return {
      id: updated.id,
      companyId: updated.companyId,
      followupTimeInHours: updated.followupTimeInHours,
      businessHours: sortBusinessHours(updated.businessHours as any),
      clientIdInstagram: updated.clientIdInstagram ?? null,
      clientSecretInstagram: updated.clientSecretInstagram ?? null,
      appIdInstagram: updated.appIdInstagram ?? null,
      tokenInstagram: updated.tokenInstagram ?? null,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async delete(id: string, companyId: string): Promise<boolean> {
    await prisma.configuration.delete({
      where: { id },
    });

    return true;
  }
}

export { ConfigurationRepositoryPrisma };
