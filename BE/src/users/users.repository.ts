import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./users.dto";
import { User } from "./users.entity";
import * as bcrypt from "bcryptjs";

export class UsersRepository {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { userId, password, nickname, email } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = User.create({
      userId,
      password: hashedPassword,
      nickname,
      email,
    });

    try {
      await user.save();
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new ConflictException("Existing userId");
      } else {
        throw new InternalServerErrorException();
      }
    }

    return user;
  }

  async getUserByUserId(userId: string): Promise<User | null> {
    return User.findOne({ where: { userId } });
  }
}
