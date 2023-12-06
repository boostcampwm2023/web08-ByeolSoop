import {
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/users.dto";
import { User } from "./users.entity";
import * as bcrypt from "bcryptjs";

export class UsersRepository {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { userId, password, nickname, email } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const userIdDuplicate = await User.findOne({ where: { userId: userId } });
    if (userIdDuplicate) {
      throw new ConflictException("중복된 아이디입니다.");
    }

    const emailDuplicate = await User.findOne({ where: { email: email } });
    if (emailDuplicate) {
      throw new ConflictException("중복된 이메일입니다.");
    }

    const user = User.create({
      userId,
      password: hashedPassword,
      nickname,
      email,
    });

    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return user;
  }

  async getUserByUserId(userId: string): Promise<User | null> {
    return User.findOne({ where: { userId } });
  }
}
