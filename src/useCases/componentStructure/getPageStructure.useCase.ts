import { NotFoundError } from "../../errors/notFound.error";
import { ComponentStructure } from "../../models/componentStructure.model";
import ComponentStructureRoleRepository from "../../repositories/componentStructureRole.repository";

export type GetPageStructureInputDTO = {
  userUID: string;
  pageName: string;
}

export class GetPageStructureUseCase {
  constructor(
    private componentStructureRoleRepository: ComponentStructureRoleRepository,
  ) { }

  async execute(input: GetPageStructureInputDTO ): Promise<ComponentStructure> {
    
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