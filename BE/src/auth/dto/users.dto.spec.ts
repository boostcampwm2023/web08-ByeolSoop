import { validate } from "class-validator";
import { CreateUserDto } from "./users.dto";

describe("CreateUserDto", () => {
  let createUserDto;

  beforeEach(() => {
    createUserDto = new CreateUserDto();
  });

  it("모든 값이 유효한 요청 시 성공", async () => {
    createUserDto.userId = "ValidUser123";
    createUserDto.email = "valid.email@test.com";
    createUserDto.password = "ValidPass123!";
    createUserDto.nickname = "ValidNickname";

    const errors = await validate(createUserDto);

    expect(errors).toHaveLength(0);
  });

  it("빈 아이디로 요청 시 실패", async () => {
    createUserDto.userId = "";
    createUserDto.email = "valid.email@test.com";
    createUserDto.password = "ValidPass123!";
    createUserDto.nickname = "ValidNickname";

    const errors = await validate(createUserDto);

    expect(errors[0].constraints.isNotEmpty).toBe(
      "아이디는 비어있지 않아야 합니다.",
    );
  });

  it("적절하지 않은 양식의 아이디로 요청 시 실패", async () => {
    createUserDto.userId = "실패";
    createUserDto.email = "valid.email@test.com";
    createUserDto.password = "ValidPass123!";
    createUserDto.nickname = "ValidNickname";

    const errors = await validate(createUserDto);

    expect(errors[0].constraints.matches).toBe(
      "생성 규칙에 맞지 않는 아이디입니다.",
    );
  });

  it("빈 이메일로 요청 시 실패", async () => {
    createUserDto.email = "";
    createUserDto.userId = "ValidUser123";
    createUserDto.password = "ValidPass123!";
    createUserDto.nickname = "ValidNickname";

    const errors = await validate(createUserDto);

    expect(errors[0].constraints.isNotEmpty).toBe(
      "이메일은 비어있지 않아야 합니다.",
    );
  });

  it("적절하지 않은 양식의 이메일로 요청 시 실패", async () => {
    createUserDto.email = "실패";
    createUserDto.userId = "ValidUser123";
    createUserDto.password = "ValidPass123!";
    createUserDto.nickname = "ValidNickname";

    const errors = await validate(createUserDto);

    expect(errors[0].constraints.matches).toBe(
      "적절하지 않은 이메일 양식입니다.",
    );
  });

  it("빈 비밀번호로 요청 시 실패", async () => {
    createUserDto.password = "";
    createUserDto.userId = "ValidUser123";
    createUserDto.email = "valid.email@test.com";
    createUserDto.nickname = "ValidNickname";

    const errors = await validate(createUserDto);

    expect(errors[0].constraints.isNotEmpty).toBe(
      "비밀번호는 비어있지 않아야 합니다.",
    );
  });

  it("적절하지 않은 양식의 비밀번호로 요청 시 실패", async () => {
    createUserDto.password = "실패";
    createUserDto.userId = "ValidUser123";
    createUserDto.email = "valid.email@test.com";
    createUserDto.nickname = "ValidNickname";

    const errors = await validate(createUserDto);

    expect(errors[0].constraints.matches).toBe(
      "생성 규칙에 맞지 않는 비밀번호 입니다.",
    );
  });

  it("빈 닉네임으로 요청 시 실패", async () => {
    createUserDto.nickname = "";
    createUserDto.userId = "ValidUser123";
    createUserDto.email = "valid.email@test.com";
    createUserDto.password = "ValidPass123!";

    const errors = await validate(createUserDto);

    expect(errors[0].constraints.isNotEmpty).toBe(
      "닉네임은 비어있지 않아야 합니다.",
    );
  });

  it("20자를 초과하는 닉네임으로 요청 시 실패", async () => {
    createUserDto.nickname = "a".repeat(21);
    createUserDto.userId = "ValidUser123";
    createUserDto.email = "valid.email@test.com";
    createUserDto.password = "ValidPass123!";

    const errors = await validate(createUserDto);

    expect(errors[0].constraints.maxLength).toBe(
      "닉네임은 20자 이하여야 합니다.",
    );
  });
});
