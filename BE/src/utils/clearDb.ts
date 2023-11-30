import { TestingModule } from "@nestjs/testing";
import { CreateUserDto } from "src/auth/dto/users.dto";
import { User } from "src/auth/users.entity";
import { UsersRepository } from "src/auth/users.repository";
import { DataSource } from "typeorm";

export async function clearUserDb(
  moduleFixture: TestingModule,
  usersRepository: UsersRepository,
) {
  // user 데이터베이스 초기화 시작
  const queryRunner = await moduleFixture
    .get<DataSource>(DataSource)
    .createQueryRunner();

  await queryRunner.startTransaction();

  try {
    // 외래 키 제약 조건을 비활성화합니다.
    await queryRunner.query("SET FOREIGN_KEY_CHECKS=0");

    await moduleFixture.get<DataSource>(DataSource).getRepository(User).clear();

    // 외래 키 제약 조건을 다시 활성화합니다.
    await queryRunner.query("SET FOREIGN_KEY_CHECKS=1");

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
  // user 데이터베이스 초기화 종료

  // 삭제된 commonUser 재생성
  await moduleFixture.get<DataSource>(DataSource).getRepository(User).clear();

  const createUserDto = new CreateUserDto();
  createUserDto.userId = "commonUser";
  createUserDto.email = "byeolsoop08@naver.com";
  createUserDto.password = process.env.COMMON_USER_PASS;
  createUserDto.nickname = "commonUser";

  await usersRepository.createUser(createUserDto);
}
