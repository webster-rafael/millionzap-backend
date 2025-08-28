import { ConfigurationRepositoryPrisma } from "../repositories/configuration-repository";
import {
  Configuration,
  ConfigurationRepository,
} from "../types/configuration-interface";

class ConfigurationUseCase {
  private configurationRepository: ConfigurationRepository;
  constructor() {
    this.configurationRepository = new ConfigurationRepositoryPrisma();
  }

  async create(data: Configuration, companyId: string): Promise<Configuration> {
    return this.configurationRepository.create(data, companyId);
  }

  async findAll(companyId: string): Promise<Configuration[]> {
    return this.configurationRepository.findAll(companyId);
  }

  async findById(id: string, companyId: string): Promise<Configuration | null> {
    return this.configurationRepository.findById(id, companyId);
  }

  async update(
    id: string,
    data: Partial<Configuration>,
    companyId: string
  ): Promise<Configuration | null> {
    return this.configurationRepository.update(id, data, companyId);
  }

  async delete(id: string, companyId: string): Promise<boolean> {
    return this.configurationRepository.delete(id, companyId);
  }
}
export { ConfigurationUseCase };
