import { validate } from "class-validator";
import { AuthCredentialsDto } from "./auth-credential.dto";

describe("AuthCredentialsDto 단위 테스트", () => {
  let authCredentialsDto;

  beforeEach(() => {
    authCredentialsDto = new AuthCredentialsDto();
  });

  it("모든 값이 유효한 요청 시 성공", async () => {
    authCredentialsDto.userId = "ValidUser123";
    authCredentialsDto.password = "ValidPassword123!";

    const errors = await validate(authCredentialsDto);

    expect(errors).toHaveLength(0);
  });

  it("빈 아이디로 요청 시 실패", async () => {
    authCredentialsDto.userId = "";
    authCredentialsDto.password = "ValidPassword123!";

    const errors = await validate(authCredentialsDto);

    expect(errors[0].constraints.isNotEmpty).toBe(
      "유저 아이디는 비어있지 않아야 합니다.",
    );
  });

  it("적절하지 않은 양식의 아이디로 요청 시 실패", async () => {
    authCredentialsDto.userId = "실패";
    authCredentialsDto.password = "ValidPassword123!";

    const errors = await validate(authCredentialsDto);

    expect(errors[0].constraints.matches).toBe(
      "적절하지 않은 유저 아이디 양식입니다.",
    );
  });

  it("빈 비밀번호로 요청 시 실패", async () => {
    authCredentialsDto.userId = "ValidUser123";
    authCredentialsDto.password = "";

    const errors = await validate(authCredentialsDto);

    expect(errors[0].constraints.isNotEmpty).toBe(
      "비밀번호는 비어있지 않아야 합니다.",
    );
  });

  it("적절하지 않은 양식의 비밀번호로 요청 시 실패", async () => {
    authCredentialsDto.userId = "ValidUser123";
    authCredentialsDto.password = "실패";

    const errors = await validate(authCredentialsDto);

    expect(errors[0].constraints.matches).toBe(
      "적절하지 않은 비밀번호 양식입니다.",
    );
  });
});
