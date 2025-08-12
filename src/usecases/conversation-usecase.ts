import {
  Conversation,
  ConversationCreate,
  ConversationRepository,
  NewConversationData,
} from "../types/conversation-interface";

class ConversationUseCase {
  private conversationRepository: ConversationRepository;
  constructor(conversationRepository: ConversationRepository) {
    this.conversationRepository = conversationRepository;
  }

  async create(
    conversation: NewConversationData,
    companyId: string
  ): Promise<Conversation> {
    return this.conversationRepository.create(conversation, companyId);
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

  async delete(id: string, companyId: string): Promise<void> {
    return this.conversationRepository.delete(id, companyId);
  }
}
export { ConversationUseCase };
