import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./users.dto";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.registerUser(createUserDto);
    return;
  }
}
