import { NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./users.dto";
import { User } from "./users.entity";

export class UsersRepository {
  async createUser(
    createUserDto: CreateUserDto,
    encodedPassword: string,
  ): Promise<User> {
    const { userId, nickname } = createUserDto;
    const password = encodedPassword;
    const newUser = User.create({ userId, password, nickname });
    await newUser.save();

    return newUser;
  }

  async getUserByUserId(userId: string): Promise<User> {
    const found = await User.findOne({ where: { userId } });
    if (!found) {
      throw new NotFoundException(`Can't find User with UserId: [${userId}]`);
    }
    return found;
  }
}
