import { prisma } from "../database/prisma-client";
import {
  Prompt,
  PromptCreateInput,
  PromptRepository,
} from "../types/prompt-interface";

class PromptRepositoryPrisma implements PromptRepository {
  async create(prompt: PromptCreateInput): Promise<Prompt> {
    const createdPrompt = await prisma.prompts.create({ data: prompt });
    return {
      id: createdPrompt.id,
      title: createdPrompt.title,
      apiKey: createdPrompt.apiKey,
      prompt: createdPrompt.prompt,
      maxTokens: createdPrompt.maxTokens,
      maxMessages: createdPrompt.maxMessages,
      promptTokens: createdPrompt.promptTokens ?? 0,
      completionTokens: createdPrompt.completionTokens ?? 0,
      totalTokens: createdPrompt.totalTokens ?? 0,
      temperature: createdPrompt.temperature ?? 0,
      assistantId: createdPrompt.assistantId ?? "",
      description: createdPrompt.description ?? "",
      companyResume: createdPrompt.companyResume,
      createdAt: createdPrompt.createdAt,
      updatedAt: createdPrompt.updatedAt,
      queueId: createdPrompt.queueId ?? "",
    };
  }

  async findAll(): Promise<Prompt[]> {
    const prompts = await prisma.prompts.findMany();
    return prompts.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      apiKey: prompt.apiKey,
      prompt: prompt.prompt,
      maxTokens: prompt.maxTokens,
      maxMessages: prompt.maxMessages,
      promptTokens: prompt.promptTokens ?? 0,
      completionTokens: prompt.completionTokens ?? 0,
      totalTokens: prompt.totalTokens ?? 0,
      temperature: prompt.temperature ?? 0,
      assistantId: prompt.assistantId ?? "",
      description: prompt.description ?? "",
      companyResume: prompt.companyResume ?? "",
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
      queueId: prompt.queueId ?? "",
    }));
  }

  async findById(id: string): Promise<Prompt | null> {
    const prompt = await prisma.prompts.findUnique({
      where: { id },
    });
    return prompt
      ? {
          id: prompt.id,
          title: prompt.title,
          apiKey: prompt.apiKey,
          prompt: prompt.prompt,
          maxTokens: prompt.maxTokens,
          maxMessages: prompt.maxMessages,
          promptTokens: prompt.promptTokens ?? 0,
          completionTokens: prompt.completionTokens ?? 0,
          totalTokens: prompt.totalTokens ?? 0,
          temperature: prompt.temperature ?? 0,
          assistantId: prompt.assistantId ?? "",
          description: prompt.description ?? "",
          companyResume: prompt.companyResume ?? "",
          createdAt: prompt.createdAt,
          updatedAt: prompt.updatedAt,
          queueId: prompt.queueId ?? "",
        }
      : null;
  }

  async update(prompt: Prompt): Promise<Prompt> {
    const updatedPrompt = await prisma.prompts.update({
      where: { id: prompt.id },
      data: {
        title: prompt.title,
        apiKey: prompt.apiKey,
        prompt: prompt.prompt,
        maxTokens: prompt.maxTokens,
        maxMessages: prompt.maxMessages,
        promptTokens: prompt.promptTokens ?? 0,
        completionTokens: prompt.completionTokens ?? 0,
        totalTokens: prompt.totalTokens ?? 0,
        temperature: prompt.temperature ?? 0,
        assistantId: prompt.assistantId ?? "",
        description: prompt.description ?? "",
        companyResume: prompt.companyResume ?? "",
        queueId: prompt.queueId ?? "",
      },
    });
    return this.toPrompt(updatedPrompt);
  }

  async delete(id: string): Promise<void> {
    await prisma.prompts.delete({
      where: { id },
    });
  }

  private toPrompt = (data: {
    id: string;
    title: string;
    apiKey: string;
    prompt: string;
    maxTokens: number;
    maxMessages: number;
    promptTokens?: number | null;
    completionTokens?: number | null;
    totalTokens?: number | null;
    temperature?: number | null;
    assistantId?: string | null;
    description?: string | null;
    companyResume?: string | null;
    createdAt: Date;
    updatedAt: Date;
    queueId: string | null;
  }): Prompt => ({
    id: data.id,
    title: data.title,
    apiKey: data.apiKey,
    prompt: data.prompt,
    maxTokens: data.maxTokens,
    maxMessages: data.maxMessages,
    promptTokens: data.promptTokens ?? 0,
    completionTokens: data.completionTokens ?? 0,
    totalTokens: data.totalTokens ?? 0,
    temperature: data.temperature ?? 0,
    assistantId: data.assistantId ?? "",
    description: data.description ?? "",
    companyResume: data.companyResume ?? "",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    queueId: data.queueId ?? "",
  });
}

export { PromptRepositoryPrisma };
