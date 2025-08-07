export interface Company {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  planId: string;
  status: boolean;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompany {
  name: string;
  phone: string;
  email: string;
  password: string;
  planId: string;
}

export interface CompanyRepository {
  create(company: CreateCompany): Promise<Company>;
  findAll(): Promise<Company[]>;
  findById(id: string): Promise<Company | null>;
  findByEmail(email: string): Promise<Company | null>;
  update(id: string, company: Company): Promise<Company>;
  delete(id: string): Promise<void>;
}
