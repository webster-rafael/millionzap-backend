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

      let planIdToUse = data.subscriptionPlanId;

      if (!planIdToUse) {
        const firstPlan = await tx.subscriptionPlan.findFirst({
          where: {
            status: "TESTING",
          },
        });

        if (firstPlan) {
          planIdToUse = firstPlan.id;
        }
      }

      if (planIdToUse) {
        await tx.companySubscription.create({
          data: {
            companyId: newCompany.id,
            planId: planIdToUse,
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
            status: "TESTING",
            paymentStatus: "PAID",
          },
        });
      }

      const newUser = await tx.user.create({
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

      const now = new Date();

      await tx.prompts.create({
        data: {
          title: "Atendimento Inicial",
          apiKey: "",
          prompt:
            "Seja uma atendente virtual de CRM. Inicie o atendimento com uma saudação e perguntando o nome do cliente. Seja educado e profissional. ",
          maxTokens: 500,
          maxMessages: 500,
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          temperature: 1,
          assistantId: "",
          description:
            "Esse prompt serve para iniciar um atendimento automatizado no CRM, coletando as informações essenciais do cliente antes de direcionar o contato. Ideal para bots de WhatsApp, sites ou formulários de cadastro.",
          companyResume: "Crie um resumo básico de empresa.",
          isActive: true,
          companyId: newCompany.id,
          createdAt: now,
          updatedAt: now,
          whatsAppConnectionId: null,
        },
      });

      await tx.prompts.create({
        data: {
          title: "Follow-up",
          apiKey: "",
          prompt: `De acordo com essa conversa entre lead e SDR, retorne apenas true ou false.
                    Retorne true se a conversa precisa de um followup, mas tem realmente que precisar de um followup.
                    Ex1: Lead respondeu que vai ver com o sócio dele se vai adquirir o produto ou não.
                    Ex2: Lead fala que vai ver se cabe no orçamento dele.
                    Ex3: Lead fala que depois entra em contato.
                    Ex4: Lead fala que vai avaliar melhor o orçamento.
                    Ex5: Lead não respondeu as perguntas da SDR ou não passou algum dado, como endereço.
                    Ex6: Lead não escolheu o produto ou não deu resposta clara do que quer.`,
          maxTokens: 500,
          maxMessages: 500,
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          temperature: 1,
          assistantId: "",
          description:
            "Você é uma IA que analisa conversas para identificar leads que precisam de follow-up.",
          companyResume: `Retorne apenas "true" ou "false". 
Jamais mande algo que não seja "true" ou "false".`,
          isActive: true,
          isDefault: true,
          companyId: newCompany.id,
          createdAt: now,
          updatedAt: now,
          whatsAppConnectionId: null,
        },
      });

      const connection = await tx.whatsAppConnection.create({
        data: {
          name: newCompany.name,
          isDefault: true,
          greetingMessage: "",
          conclusionMessage: "",
          outOfOfficeHoursMessage: "",
          reviewMessage: "",
          token: "",
          queueId: "",
          integrationId: null,
          userId: newUser.id,
          promptId: "",
          transferQueueId: "",
          timeToTransfer: "0",
          expiresInactiveMessage: "",
          companyId: newCompany.id,
          session: "",
          instanceId: "",
          instanceName: "",
          status: "OPEN",
          createdAt: now,
          updatedAt: now,
        },
      });

      await tx.user.update({
        where: { id: newUser.id },
        data: { connectionId: connection.id },
      });

      await tx.tags.createMany({
        data: [
          {
            title: "Em aberto",
            color: "#06B6D4",
            order: 1,
            description: "",
            companyId: newCompany.id,
            createdAt: now,
            updatedAt: now,
          },
          {
            title: "Em atendimento",
            color: "#10B981",
            order: 2,
            description: "",
            companyId: newCompany.id,
            createdAt: now,
            updatedAt: now,
          },
          {
            title: "Follow-Up",
            color: "#6366F1",
            order: 3,
            description: "",
            companyId: newCompany.id,
            createdAt: now,
            updatedAt: now,
          },
          // {
          //   title: "Follow-Up Recuperado",
          //   color: "#06B6D4",
          //   order: 4,
          //   description: "",
          //   companyId: newCompany.id,
          //   createdAt: now,
          //   updatedAt: now,
          // },
        ],
      });

      const result = await tx.company.findUniqueOrThrow({
        where: { id: newCompany.id },
        include: {
          users: true,
          subscriptions: {
            include: { plan: true },
            orderBy: { createdAt: "desc" },
          },
          prompts: true,
          tags: true,
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
