import { NoteRepositoryPrisma } from "../repositories/note-repository";
import { Note, NoteCreateInput, NoteRepository } from "../types/note-interface";

class noteUseCase {
  private noteRepository: NoteRepository;
  constructor() {
    this.noteRepository = new NoteRepositoryPrisma();
  }

  async create(note: NoteCreateInput, contactId: string): Promise<Note> {
    return this.noteRepository.create(note, contactId);
  }

  async findAll(contactId: string): Promise<Note[]> {
    return this.noteRepository.findAll(contactId);
  }

  async findById(id: string): Promise<Note | null> {
    return this.noteRepository.findById(id);
  }

  async update(id: string, note: Partial<NoteCreateInput>): Promise<Note> {
    return this.noteRepository.update(id, note);
  }

  async delete(id: string): Promise<void> {
    return this.noteRepository.delete(id);
  }
}
export { noteUseCase };
