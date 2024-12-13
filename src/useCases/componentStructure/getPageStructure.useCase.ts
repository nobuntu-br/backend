import { NotFoundError } from "../../errors/notFound.error";
import { ComponentStructure } from "../../models/componentStructure.model";
import { GetPageStructureDTO } from "../../models/DTO/getPageStructure.DTO";
import ComponentStructureRoleRepository from "../../repositories/componentStructureRole.repository";

export class GetPageStructureUseCase {
  constructor(
    private componentStructureRoleRepository: ComponentStructureRoleRepository,
  ) { }

  async execute(input: GetPageStructureDTO ): Promise<ComponentStructure> {
    
    const pageStructure: ComponentStructure = await this.componentStructureRoleRepository.getPageStructure(input.userUID, input.pageName);  
    //verificar a role do usuário

    if(pageStructure == null){
      throw new NotFoundError("Page structure not found");
    }

    return pageStructure;

    //verificar qual role tá ligada ao component

    // return await this.componentStructureRepository.findOne({id: componentStructureId, componentName: input.pageName});
  }
}