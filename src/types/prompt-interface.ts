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
}

export type PromptCreateInput = Omit<Prompt, "id" | "createdAt" | "updatedAt">;

export interface PromptRepository {
  create(prompt: PromptCreateInput): Promise<Prompt>;
  findAll(): Promise<Prompt[]>;
  findById(id: string): Promise<Prompt | null>;
  update(prompt: Prompt): Promise<Prompt>;
  delete(id: string): Promise<void>;
}
