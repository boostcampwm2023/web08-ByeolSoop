import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./users.dto";
import { UsersRepository } from "./users.repository";
import { User } from "./users.entity";

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }
}
