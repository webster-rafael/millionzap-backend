import { ToDoRepositoryPrisma } from "../repositories/todo-repository";
import { CreateToDo, ToDo, ToDoRepository } from "../types/todo-interface";

class ToDoUseCase {
  private todoRepository: ToDoRepository;

  constructor() {
    this.todoRepository = new ToDoRepositoryPrisma();
  }

  async create(todo: CreateToDo, userId: string): Promise<ToDo> {
    return this.todoRepository.create(todo, userId);
  }

  async findAll(userId: string): Promise<ToDo[]> {
    return this.todoRepository.findAll(userId);
  }

  async update(
    id: string,
    todo: Partial<CreateToDo>,
    userId: string
  ): Promise<ToDo> {
    return this.todoRepository.update(id, todo, userId);
  }

  async findById(id: string, userId: string): Promise<ToDo | null> {
    const todo = await this.todoRepository.findById(id, userId);
    return todo;
  }

  // Deletar → só o criador pode
  async delete(id: string, userId: string): Promise<void> {
    return this.todoRepository.delete(id, userId);
  }
}

export { ToDoUseCase };
