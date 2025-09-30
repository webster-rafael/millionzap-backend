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
          status: true,
          dueDate: new Date(),
        },
      });

      if (data.subscriptionPlanId) {
        await tx.companySubscription.create({
          data: {
            companyId: newCompany.id,
            planId: data.subscriptionPlanId,
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            status: "ACTIVE",
            paymentStatus: "PAID",
          },
        });
      }

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
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            plan: true,
          },
        },
      },
    });
    if (!company) return null;

    const subscription = company.subscriptions[0];
    if (subscription) {
      const today = new Date();
      const endDate = new Date(subscription.endDate || "");
      const timeDiff = endDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      (subscription as any).daysLeft = daysLeft;
    }

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
