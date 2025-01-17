import { IidentityService } from "../../domain/services/Iidentity.service";

export type GetUserProfilePhotoInputDTO = {
  userID: string;
}

export type GetUserProfilePhotoOutputDTO = {
  imageUrl: string;
}

export class GetUserProfilePhotoUseCase {

  constructor(
    private identityService: IidentityService
  ) {}

  async execute(input: GetUserProfilePhotoInputDTO): Promise<GetUserProfilePhotoOutputDTO> {
    return await this.identityService.getUserProfilePhoto(input.userID);
  }

}