import { prisma } from "../database/prisma-client";
import {
  Company,
  CompanyRepository,
  CreateCompany,
} from "../types/company-interface";
import bcrypt from "bcryptjs";

class CompanyRepositoryPrisma implements CompanyRepository {
  async create(data: CreateCompany): Promise<Company> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const company = await prisma.$transaction(async (tx) => {
      const newCompany = await tx.company.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          subscriptionPlanId: data.subscriptionPlanId,
          status: true,
          dueDate: new Date(),
        },
      });

      await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          companyId: newCompany.id,
          connectionId: "",
          role: "OWNER",
        },
      });

      const result = await tx.company.findUniqueOrThrow({
        where: { id: newCompany.id },
        include: {
          users: true,
        },
      });

      return result;
    });

    return company as Company;
  }

  async findAll(): Promise<Company[]> {
    const companies = await prisma.company.findMany();
    return companies;
  }

  async findById(id: string): Promise<Company | null> {
    const company = await prisma.company.findUnique({
      where: {
        id,
      },
    });
    return company;
  }

  async findByEmail(email: string): Promise<Company | null> {
    const company = await prisma.company.findUnique({
      where: {
        email,
      },
    });
    return company;
  }

  async update(id: string, company: Company): Promise<Company> {
    const companyUpdated = await prisma.company.update({
      where: {
        id,
      },
      data: {
        ...company,
      },
    });
    return companyUpdated;
  }

  async delete(id: string): Promise<void> {
    await prisma.company.delete({
      where: {
        id,
      },
    });
  }
}

export { CompanyRepositoryPrisma };
