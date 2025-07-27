export interface QuickResponse {
  id: string;
  title: string;
  shortcut: string;
  createdAt: Date;
  updatedAt: Date;
  queueId: string;
}

export interface QuickResponseCreate {
  title: string;
  shortcut: string;
  queueId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuickResponseRepository {
  create(data: QuickResponseCreate): Promise<QuickResponse>;
  // findById(id: string): Promise<QuickResponse | null>;
  // findAll(): Promise<QuickResponse[]>;
  // update(
  //   id: string,
  //   data: Partial<QuickResponse>
  // ): Promise<QuickResponse | null>;
  // delete(id: string): Promise<boolean>;
}
