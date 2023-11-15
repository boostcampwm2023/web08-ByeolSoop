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
}
