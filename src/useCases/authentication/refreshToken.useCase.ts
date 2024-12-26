import { NotFoundError } from "../../errors/notFound.error";
import UserRepository from "../../repositories/user.repository";
import { IidentityService } from "../../services/Iidentity.service";
import { TokenService } from "../../services/token.service";

interface RefreshTokenInputDTO {
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private userRepository: UserRepository,
    private identityService: IidentityService
  ) { }

  async execute(input: RefreshTokenInputDTO): Promise<string> {
    // const { refreshToken } = input;

    //TESTE
    const tokenService: TokenService = new TokenService(process.env.JWKsUri!);

    // Validar o refresh token
    const isValid = tokenService.verifyToken(input.refreshToken);

    if (!isValid) {
      throw new Error('Invalid refresh token');
    }

    // Buscar usuário associado ao refresh token
    const userUID = tokenService.decodeRefreshToken(input.refreshToken);
    const user = await this.userRepository.findOne({UID: userUID});
    if (user == null) {
      throw new NotFoundError('User not found');
    }

    // Gerar novo token de acesso
    // const newAccessToken = this.tokenService.generateAccessToken(user);
    // return newAccessToken;

    return await this.identityService.refreshAccessToken(input.refreshToken);
  }
}
