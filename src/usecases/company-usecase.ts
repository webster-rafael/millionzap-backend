import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Prisma } from "../generated/prisma-client/index.js";
import { Company, CreateCompany } from "../types/company-interface.js";
import { CompanyRepositoryPrisma } from "../repositories/company-repository.js";
import { UserRepositoryPrisma } from "../repositories/user-repository.js";
import { User } from "../types/user-interface.js";

type CompanyWithUsers = Prisma.CompanyGetPayload<{
  include: { users: true };
}>;

export interface CreateCompanyResponse {
  company: Omit<Company, "password">;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

class CompanyUseCase {
  private companyRepository: CompanyRepositoryPrisma;
  private userRepository: UserRepositoryPrisma;
  constructor() {
    this.companyRepository = new CompanyRepositoryPrisma();
    this.userRepository = new UserRepositoryPrisma();
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Credenciais inválidas");
    }
    const company = await this.companyRepository.findById(user.companyId);

    const payload = {
      id: user.id,
      companyId: user.companyId,
      role: user.role,
      companyName: company?.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    if (!company) {
      throw new Error("Empresa associada ao usuário não encontrada.");
    }
    return {
      user: user,
      token,
    };
  }

  async create(companyData: CreateCompany): Promise<CreateCompanyResponse> {
    const company = (await this.companyRepository.create(
      companyData
    )) as CompanyWithUsers;

    const initialUser = company.users?.[0];

    if (!initialUser) {
      throw new Error("Falha ao criar o usuário inicial para a empresa.");
    }

    const token = jwt.sign(
      {
        id: initialUser.id,
        companyId: company.id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "10d",
      }
    );

    const { users, ...companyToReturn } = company;
    return { company: companyToReturn, token };
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.findAll();
  }

  async findById(id: string): Promise<Company | null> {
    return this.companyRepository.findById(id);
  }

  async update(id: string, company: Company): Promise<Company> {
    return this.companyRepository.update(id, company);
  }

  async delete(id: string): Promise<void> {
    return this.companyRepository.delete(id);
  }
}

export { CompanyUseCase };
