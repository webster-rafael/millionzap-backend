import { UserRepositoryPrisma } from "../repositories/user-repository";
import {
  User,
  UserCreate,
  UserCreateInput,
  UserRepository,
} from "../types/user-interface";

class UserUseCase {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepositoryPrisma();
  }
  async create(user: UserCreateInput): Promise<User> {
    return this.userRepository.create(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async update(id: string, user: User): Promise<User> {
    return this.userRepository.update(id, user);
  }

  async delete(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
export { UserUseCase };
