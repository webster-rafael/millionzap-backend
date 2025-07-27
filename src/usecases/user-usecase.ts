import { UserRepositoryPrisma } from "../repositories/user-repository";
import { User, UserCreate, UserRepository } from "../types/user-interface";

class UserUseCase {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepositoryPrisma();
  }
  async create({
    name,
    email,
    password,
    phone,
    role,
  }: UserCreate): Promise<User> {
    const user = await this.userRepository.create({
      name,
      email,
      password,
      phone,
      role,
    });
    return user;
  }
}
export { UserUseCase };
