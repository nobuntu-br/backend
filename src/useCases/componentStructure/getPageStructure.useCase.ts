import { ComponentStructure } from "../../domain/entities/fixes/componentStructure.model";
import ComponentStructureRepository from "../../domain/repositories/fixes/componentStructure.repository";
import UserRepository from "../../domain/repositories/fixes/user.repository";
import { NotFoundError } from "../../errors/notFound.error";

export type GetPageStructureInputDTO = {
  userId: number;
  componentName: string;
}

export class GetPageStructureUseCase {
  constructor(
    private componentStructureRepository: ComponentStructureRepository,
    private userRepository: UserRepository
  ) { }

  async execute(input: GetPageStructureInputDTO): Promise<ComponentStructure> {

    try {
      let pageStructure: ComponentStructure | null = null;

      const isUserAdmin = await this.userRepository.isUserAdminById(input.userId);

      if (isUserAdmin != null || isUserAdmin == true) {
        pageStructure = await this.componentStructureRepository.findOne({ componentName: input.componentName });
      } else {
        pageStructure = await this.componentStructureRepository.getPageStructure(input.userId, input.componentName);
      }

      if (pageStructure != null) {
        return pageStructure;
      }
      
      throw new NotFoundError("Page structure not found.");
    } catch (error) {
      throw error;
    }
  }
}