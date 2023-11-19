import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "src/users/users.repository";
import { AccessTokenDto, AuthCredentialsDto } from "./auth-credential.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<AccessTokenDto> {
    const { userId, password } = authCredentialsDto;
    const user = await this.usersRepository.getUserByUserId(userId);

    if (user && btoa(password) === user.password) {
      const payload = { userId };
      const accessToken = await this.jwtService.sign(payload);

      return new AccessTokenDto(accessToken);
    } else {
      throw new UnauthorizedException("login failed");
    }
  }
}
