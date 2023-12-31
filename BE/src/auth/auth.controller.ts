import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Redirect,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import {
  ExpiredOrNotGuard,
  NoDuplicateLoginGuard,
} from "./guard/auth.user-guard";
import { CreateUserDto } from "./dto/users.dto";
import { User } from "./users.entity";
import { GetUser } from "./get-user.decorator";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("/kakao/callback")
  @UseGuards(AuthGuard("kakao"))
  @Redirect(process.env.FRONTEND_URL, 302)
  async kakaoSignIn(
    @GetUser() user: User,
    @Req() request: Request,
  ): Promise<object> {
    const loginResponseDto: LoginResponseDto =
      await this.authService.kakaoSignIn(user, request);
    return {
      url: `${process.env.FRONTEND_URL}?access-token=${loginResponseDto.accessToken}&nickname=${loginResponseDto.nickname}`,
    };
  }

  @Get("/naver/callback")
  @UseGuards(AuthGuard("naver"))
  @Redirect(process.env.FRONTEND_URL, 302)
  async naverSignIn(
    @GetUser() user: User,
    @Req() request: Request,
  ): Promise<object> {
    const loginResponseDto: LoginResponseDto =
      await this.authService.naverSignIn(user, request);
    return {
      url: `${process.env.FRONTEND_URL}?access-token=${loginResponseDto.accessToken}&nickname=${loginResponseDto.nickname}`,
    };
  }

  @Post("/signup")
  @HttpCode(204)
  async signUp(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.authService.signUp(createUserDto);
    return;
  }

  @Post("/signin")
  @UseGuards(NoDuplicateLoginGuard)
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Req() request: Request,
  ): Promise<LoginResponseDto> {
    return await this.authService.signIn(authCredentialsDto, request);
  }

  @Post("/signout")
  @UseGuards(ExpiredOrNotGuard)
  @HttpCode(204)
  async signOut(@GetUser() user: User): Promise<void> {
    await this.authService.signOut(user.userId);
  }

  @Post("/reissue")
  @UseGuards(ExpiredOrNotGuard)
  @HttpCode(201)
  async reissueAccessToken(@Req() request: Request): Promise<LoginResponseDto> {
    return await this.authService.reissueAccessToken(request);
  }
}
