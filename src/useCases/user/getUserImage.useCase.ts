import { GetUserImageInputDTO, GetUserImageOutputDTO } from "../../models/DTO/getUserImage.DTO";
import { IidentityService } from "../../services/Iidentity.service";

export class GetUserImageUseCase {

  constructor(
    private identityService: IidentityService
  ) {}

  async execute(input: GetUserImageInputDTO): Promise<GetUserImageOutputDTO> {
    console.log(input);
    return await this.identityService.getUserImage(input.userID);
  }

}