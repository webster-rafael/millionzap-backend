import {
  ConversationInstagram,
  ConversationInstagramRepository,
  NewConversationData,
  ConversationInstagramUpdate,
} from "../types/conversationInstagram-interface";

class ConversationInstagramUseCase {
  private conversationRepository: ConversationInstagramRepository;
  constructor(conversationRepository: ConversationInstagramRepository) {
    this.conversationRepository = conversationRepository;
  }

  async create(
    conversation: NewConversationData,
    companyId: string
  ): Promise<ConversationInstagram> {
    return this.conversationRepository.create(conversation, companyId);
  }

  async findAll(companyId: string): Promise<ConversationInstagram[]> {
    return this.conversationRepository.findAll(companyId);
  }

  async findById(
    id: string,
    companyId: string
  ): Promise<ConversationInstagram | null> {
    return this.conversationRepository.findById(id, companyId);
  }

  async update(
    id: string,
    conversation: ConversationInstagramUpdate
  ): Promise<ConversationInstagram> {
    return this.conversationRepository.update(id, conversation);
  }

  async findForKanban(companyId: string): Promise<ConversationInstagram[]> {
    return this.conversationRepository.findForKanban(companyId);
  }

  async delete(id: string, companyId: string): Promise<void> {
    return this.conversationRepository.delete(id, companyId);
  }
}
export { ConversationInstagramUseCase };
