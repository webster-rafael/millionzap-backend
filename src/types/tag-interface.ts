export interface Tags {
  id: string;
  title: string;
  color: string;
  order: number;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTags {
  title: string;
  color: string;
  order: number;
  description?: string | null;
}

export interface TagsRepository {
  create(tags: CreateTags): Promise<Tags>;
  findAll(): Promise<Tags[]>;
  update(id: string, tags: Partial<CreateTags>): Promise<Tags>;
  findById(id: string): Promise<Tags | null>;
  delete(id: string): Promise<void>;
}
