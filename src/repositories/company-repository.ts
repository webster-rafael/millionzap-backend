import { prisma } from "../database/prisma-client";
import {
  Company,
  CompanyRepository,
  CreateCompany,
} from "../types/company-interface";
import bcrypt from "bcryptjs";

class CompanyRepositoryPrisma implements CompanyRepository {
  async create(company: CreateCompany): Promise<Company> {
    const hashedPassword = await bcrypt.hash(company.password, 10);
    const companyCreated = await prisma.company.create({
      data: {
        ...company,
        name: company.name,
        email: company.email,
        phone: company.phone,
        planId: company.planId,
        password: hashedPassword,
        status: true,
        dueDate: new Date(),
      },
    });
    const { password, ...companyWithoutPassword } = companyCreated;
    return companyWithoutPassword as Company;
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
