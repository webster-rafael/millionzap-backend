import { prisma } from "../database/prisma-client";
import { Note, NoteCreateInput, NoteRepository } from "../types/note-interface";

class NoteRepositoryPrisma implements NoteRepository {
  async create(note: NoteCreateInput, contactId: string): Promise<Note> {
    const newNote = await prisma.note.create({
      data: {
        ...note,
        contactId: contactId,
      },
    });
    return newNote;
  }
  async findAll(contactId: string): Promise<Note[]> {
    const notes = await prisma.note.findMany({
      where: { contactId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    return notes.map((note) => ({
      id: note.id,
      content: note.content,
      userId: note.userId,
      contactId: note.contactId,
      createdAt: note.createdAt,
    }));
  }
  async findById(id: string): Promise<Note | null> {
    const note = await prisma.note.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!note) return null;
    return {
      id: note.id,
      content: note.content,
      userId: note.userId,
      contactId: note.contactId,
      createdAt: note.createdAt,
    };
  }

  async update(id: string, note: Partial<NoteCreateInput>): Promise<Note> {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: note,
    });
    return {
      id: updatedNote.id,
      content: updatedNote.content,
      userId: updatedNote.userId,
      contactId: updatedNote.contactId,
      createdAt: updatedNote.createdAt,
    };
  }
  async delete(id: string): Promise<void> {
    await prisma.note.delete({
      where: { id },
    });
  }
}

export { NoteRepositoryPrisma };
