export interface Prompt {
  id: string;
  title: string;
  apiKey: string;
  prompt: string;
  maxTokens: number;
  maxMessages: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  temperature?: number;
  assistantId?: string;
  description?: string;
  companyResume: string;
  companyId: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  queueId: string;
}
export interface PromptCreate {
  title: string;
  apiKey: string;
  prompt: string;
  maxTokens: number;
  maxMessages: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  temperature?: number;
  assistantId?: string;
  description?: string;
  companyResume: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  queueId: string;
  companyId: string;
}

export type PromptCreateInput = Omit<Prompt, "id" | "createdAt" | "updatedAt">;

export interface PromptRepository {
  create(prompt: PromptCreateInput, companyId: string): Promise<Prompt>;
  findAll(companyId: string): Promise<Prompt[]>;
  findById(id: string, companyId: string): Promise<Prompt | null>;
  update(prompt: Prompt, companyId: string): Promise<Prompt>;
  delete(id: string, companyId: string): Promise<void>;
}
