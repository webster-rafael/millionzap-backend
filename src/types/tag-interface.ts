export interface Tags {
  id: string;
  title: string;
  color: string;
  order: number;
  description?: string | null;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTags {
  title: string;
  color: string;
  order: number;
  description?: string | null;
  companyId: string;
}

export interface TagsRepository {
  create(tags: CreateTags, companyId: string): Promise<Tags>;
  findAll(companyId: string): Promise<Tags[]>;
  update(
    id: string,
    tags: Partial<CreateTags>,
    companyId: string
  ): Promise<Tags>;
  findById(id: string, companyId: string): Promise<Tags | null>;
  delete(id: string, companyId: string): Promise<void>;
}
