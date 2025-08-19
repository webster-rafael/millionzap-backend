import {
  User,
  UserCreate,
  UserCreateInput,
  UserRepository,
} from "../types/user-interface";
import bcrypt from "bcryptjs";

class UserUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async create(user: UserCreate, companyId: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userWithHashedPassword = {
      ...user,
      password: hashedPassword,
    };

    return this.userRepository.create(userWithHashedPassword, companyId);
  }

  async findAll(companyId: string): Promise<User[]> {
    return this.userRepository.findAll(companyId);
  }

  async findById(id: string, companyId: string): Promise<User | null> {
    return this.userRepository.findById(id, companyId);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async update(
    id: string,
    user: UserCreateInput,
    companyId: string
  ): Promise<User> {
    const dataToUpdate = { ...user };

    if (dataToUpdate.password && dataToUpdate.password.trim() !== "") {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
    } else {
      delete (dataToUpdate as Partial<User>).password;
    }

    return this.userRepository.update(id, dataToUpdate, companyId);
  }

  async delete(id: string, companyId: string): Promise<void> {
    return this.userRepository.delete(id, companyId);
  }
}

export { UserUseCase };
