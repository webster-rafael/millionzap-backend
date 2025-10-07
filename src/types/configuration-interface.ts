export interface BusinessHours {
  domingo: { closed: boolean; open?: string; close?: string };
  segunda: { closed: boolean; open?: string; close?: string };
  terca: { closed: boolean; open?: string; close?: string };
  quarta: { closed: boolean; open?: string; close?: string };
  quinta: { closed: boolean; open?: string; close?: string };
  sexta: { closed: boolean; open?: string; close?: string };
  sabado: { closed: boolean; open?: string; close?: string };

  [key: string]: any;
}
export interface Configuration {
  id: string;
  companyId: string;
  followupTimeInHours: number;
  businessHours: BusinessHours;
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
