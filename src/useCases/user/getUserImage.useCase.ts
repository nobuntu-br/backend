import { GetUserImageInputDTO, GetUserImageOutputDTO } from "../../models/DTO/getUserImage.DTO";
import { IidentityService } from "../../services/Iidentity.service";

export class GetUserImageUseCase {

  constructor(
    private identityService: IidentityService
  ) {}

  async execute(input: GetUserImageInputDTO): Promise<GetUserImageOutputDTO> {
    return await this.identityService.getUserImage(input.userID);
  }

}