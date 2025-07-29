export interface QuickResponse {
  id: string;
  title: string;
  message: string;
  shortcut: string;
  createdAt: Date;
  updatedAt: Date;
  queueId: string;
}

export interface QuickResponseCreate {
  title: string;
  message: string;
  shortcut: string;
  queueId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type QuickResponseCreateInput = Omit<
  QuickResponse,
  "id" | "createdAt" | "updatedAt"
>;

export interface QuickResponseRepository {
  create(data: QuickResponseCreateInput): Promise<QuickResponse>;
  findAll(): Promise<QuickResponse[]>;
  findById(id: string): Promise<QuickResponse | null>;
  update(data: QuickResponse): Promise<QuickResponse>;
  delete(id: string): Promise<QuickResponse>;
}
