import { CompanyRepositoryPrisma } from "../repositories/company-repository";
import { Company, CreateCompany } from "../types/company-interface";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export interface CreateCompanyResponse {
  company: Omit<Company, "password">;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type LoginResponse = CreateCompanyResponse;

class CompanyUseCase {
  private companyRepository: CompanyRepositoryPrisma;
  constructor() {
    this.companyRepository = new CompanyRepositoryPrisma();
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const company = await this.companyRepository.findByEmail(credentials.email);
    if (!company) {
      throw new Error("Credenciais inválidas");
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      company.password
    );
    if (!isPasswordValid) {
      throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign(
      {
        id: company.id,
        email: company.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    const { password, ...companyWithoutPassword } = company;
    return {
      company: companyWithoutPassword as Company,
      token,
    };
  }

  async create(companyData: CreateCompany): Promise<CreateCompanyResponse> {
    const company = await this.companyRepository.create(companyData);

    const token = jwt.sign(
      {
        id: company.id,
        email: company.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "10d",
      }
    );

    return { company, token };
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
