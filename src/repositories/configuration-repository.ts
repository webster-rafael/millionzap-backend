import { Configuration } from "@prisma/client";
import { ConfigurationRepository } from "../types/configuration-interface";
import { prisma } from "../database/prisma-client";

class ConfigurationRepositoryPrisma implements ConfigurationRepository {
  async create(data: Configuration, companyId: string): Promise<Configuration> {
    const configuration = await prisma.configuration.create({
      data: {
        ...data,
        companyId,
      },
    });

    return configuration;
  }

  async findAll(companyId: string): Promise<Configuration[]> {
    const configurations = await prisma.configuration.findMany({
      where: {
        companyId,
      },
    });

    return configurations;
  }

  async findById(id: string): Promise<Configuration | null> {
    const configuration = await prisma.configuration.findUnique({
      where: {
        id,
      },
    });

    return configuration;
  }

  async update(
    id: string,
    data: Partial<Configuration>
  ): Promise<Configuration | null> {
    const configuration = await prisma.configuration.update({
      where: {
        id,
      },
      data,
    });

    return configuration;
  }

  async delete(id: string): Promise<boolean> {
    const configuration = await prisma.configuration.delete({
      where: {
        id,
      },
    });

    return configuration !== null;
  }
}
export { ConfigurationRepositoryPrisma };
