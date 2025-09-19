import { prisma } from "../database/prisma-client";
import { CreateToDo, ToDo, ToDoRepository } from "../types/todo-interface";

class ToDoRepositoryPrisma implements ToDoRepository {
  async create(todo: CreateToDo, userId: string): Promise<ToDo> {
    const createdToDo = await prisma.toDo.create({
      data: {
        ...todo,
        createdById: userId,
        dueDate: todo.dueDate
          ? new Date(todo.dueDate + "T00:00:00")
          : undefined,
      },
    });
    return this.toToDo(createdToDo);
  }

  async findAll(userId: string): Promise<ToDo[]> {
    const todos = await prisma.toDo.findMany({
      where: {
        OR: [{ createdById: userId }, { responsibleId: userId }],
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        responsible: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return todos.map(this.toToDo);
  }

  async update(
    id: string,
    data: Partial<CreateToDo>,
    userId: string
  ): Promise<ToDo> {
    const todo = await prisma.toDo.findUnique({ where: { id } });
    if (!todo) throw new Error("Tarefa não encontrada");

    if (todo.createdById === userId) {
      const updated = await prisma.toDo.update({
        where: { id },
        data: {
          ...data,
          dueDate: data.dueDate
            ? new Date(data.dueDate + "T00:00:00")
            : todo.dueDate,
          updatedAt: new Date(),
        },
      });
      return this.toToDo(updated);
    }

    if (todo.responsibleId === userId) {
      if (typeof data.completed === "boolean") {
        const updated = await prisma.toDo.update({
          where: { id },
          data: { completed: data.completed },
        });
        return this.toToDo(updated);
      }
      throw new Error("Você só pode marcar a tarefa como concluída");
    }

    throw new Error("Você não tem permissão para editar esta tarefa");
  }

  async findById(id: string, companyId: string): Promise<ToDo | null> {
    const todo = await prisma.toDo.findUnique({
      where: { id, companyId },
    });

    return todo ? this.toToDo(todo) : null;
  }

  async delete(id: string, userId: string): Promise<void> {
    const deleted = await prisma.toDo.deleteMany({
      where: { id, createdById: userId },
    });

    if (deleted.count === 0) {
      throw new Error("Tarefa não encontrada ou você não é o criador");
    }
  }

  toToDo(prismaToDo: any): ToDo {
    return {
      id: prismaToDo.id,
      title: prismaToDo.title,
      description: prismaToDo.description,
      completed: prismaToDo.completed,
      priority: prismaToDo.priority,
      dueDate: prismaToDo.dueDate,
      createdAt: prismaToDo.createdAt,
      updatedAt: prismaToDo.updatedAt,
      createdById: prismaToDo.createdById,
      responsibleId: prismaToDo.responsibleId,
      createdBy: prismaToDo.createdBy
        ? { id: prismaToDo.createdBy.id, name: prismaToDo.createdBy.name }
        : undefined,
      responsible: prismaToDo.responsible
        ? { id: prismaToDo.responsible.id, name: prismaToDo.responsible.name }
        : undefined,
    };
  }
}

export { ToDoRepositoryPrisma };
