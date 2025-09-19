export interface ToDo {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  responsibleId?: string | null;
  createdById?: string | null;
  companyId?: string | null;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: { id: string; name: string };
  responsible?: { id: string; name: string };
}

export interface CreateToDo {
  title: string;
  description?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  responsibleId?: string | null;
  createdById?: string | null;
  dueDate?: Date | null;
  completed: boolean;
  companyId?: string | null;
}

export interface ToDoRepository {
  create(todo: CreateToDo, companyId: string): Promise<ToDo>;
  findAll(userId: string): Promise<ToDo[]>;
  update(
    id: string,
    todo: Partial<CreateToDo>,
    companyId: string
  ): Promise<ToDo>;
  findById(id: string, companyId: string): Promise<ToDo | null>;
  delete(id: string, companyId: string): Promise<void>;
}
