import { ConversationRepositoryPrisma } from "../repositories/conversation-repository";
import {
  Conversation,
  ConversationCreate,
  ConversationRepository,
} from "../types/conversation-interface";

class ConversationUseCase {
  private conversationRepository: ConversationRepository;
  constructor() {
    this.conversationRepository = new ConversationRepositoryPrisma();
  }
  async findAll(): Promise<Conversation[]> {
    return this.conversationRepository.findAll();
  }

  async findById(id: string): Promise<Conversation | null> {
    return this.conversationRepository.findById(id);
  }

  async update(
    id: string,
    conversation: ConversationCreate
  ): Promise<Conversation> {
    return this.conversationRepository.update(id, conversation);
  }

  async findForKanban(): Promise<Conversation[]> {
    return this.conversationRepository.findForKanban();
  }
}
export { ConversationUseCase };
