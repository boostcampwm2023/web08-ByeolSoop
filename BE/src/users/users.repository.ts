import { CreateUserDto } from "./users.dto";
import { User } from "./users.entity";

export class UsersRepository {
  async createUser(
    createUserDto: CreateUserDto,
    encodedPassword: string,
  ): Promise<User> {
    const { userID, nickname } = createUserDto;
    const password = encodedPassword;
    const newUser = User.create({ userID, password, nickname });
    await newUser.save();

    return newUser;
  }
}
