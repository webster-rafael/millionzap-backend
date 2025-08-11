import {
  Conversation,
  ConversationCreate,
  ConversationRepository,
} from "../types/conversation-interface";

class ConversationUseCase {
  private conversationRepository: ConversationRepository;
  constructor(conversationRepository: ConversationRepository) {
    this.conversationRepository = conversationRepository;
  }
  async findAll(companyId: string): Promise<Conversation[]> {
    return this.conversationRepository.findAll(companyId);
  }

  async findById(id: string, companyId: string): Promise<Conversation | null> {
    return this.conversationRepository.findById(id, companyId);
  }

  async update(
    id: string,
    conversation: ConversationCreate
  ): Promise<Conversation> {
    return this.conversationRepository.update(id, conversation);
  }

  async findForKanban(companyId: string): Promise<Conversation[]> {
    return this.conversationRepository.findForKanban(companyId);
  }
}
export { ConversationUseCase };
