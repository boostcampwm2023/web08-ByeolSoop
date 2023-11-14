import { CreateUserDto } from "./users.dto";
import { User } from "./users.entity";

export class UsersRepository {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { userID, password, nickname } = createUserDto;

    const newUser = User.create({ userID, password, nickname });
    await newUser.save();

    return newUser;
  }
}
