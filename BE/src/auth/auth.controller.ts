import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import { AccessTokenDto } from "./dto/auth-access-token.dto";
import { NoDuplicateLoginGuard } from "./guard/auth.user-guard";
import { CreateUserDto } from "./dto/users.dto";
import { User } from "./users.entity";
import { GetUser } from "./get-user.decorator";
import { JwtAuthGuard } from "./guard/auth.jwt-guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  async signUp(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.authService.signUp(createUserDto);
    return;
  }

  @Post("/signin")
  @UseGuards(NoDuplicateLoginGuard)
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<AccessTokenDto> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post("/signout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  signOut(@GetUser() user: User): void {
    this.authService.signOut(user);
  }
}
