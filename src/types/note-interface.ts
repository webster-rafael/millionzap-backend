export interface Note {
  id: string;
  content: string;
  userId: string;
  contactId: string;
  createdAt: Date;
}

export type NoteCreateInput = Omit<Note, "id" | "createdAt">;

export interface NoteRepository {
  create(note: NoteCreateInput, contactId: string): Promise<Note>;
  findAll(contactId: string): Promise<Note[]>;
  findById(id: string): Promise<Note | null>;
  update(id: string, note: Partial<NoteCreateInput>): Promise<Note>;
  delete(id: string): Promise<void>;
}
