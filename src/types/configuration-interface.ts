export interface Configuration {
  id: string;
  companyId: string;
  followupTimeInHours: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConfigurationRepository {
  create(data: Configuration, companyId: string): Promise<Configuration>;
  findAll(companyId: string): Promise<Configuration[]>;
  findById(id: string, companyId: string): Promise<Configuration | null>;
  update(
    id: string,
    data: Partial<Configuration>,
    companyId: string
  ): Promise<Configuration | null>;
  delete(id: string, companyId: string): Promise<boolean>;
}
