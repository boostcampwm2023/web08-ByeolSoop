import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { ValidationPipe } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { typeORMConfig } from "src/configs/typeorm.config";
import { User } from "src/auth/users.entity";

describe("[회원가입] /auth/signup POST 통합 테스트", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig), AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("정상 요청 시 204 Created 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUserId",
        password: "TestPassword",
        email: "testemail@naver.com",
        nickname: "TestUser",
      })
      .expect(204);

    const testUser = await User.findOne({ where: { userId: "TestUserId" } });
    if (testUser) {
      await User.remove(testUser);
    }
  });

  it("중복된 아이디에 대한 요청 시 409 Conflict 응답", async () => {
    await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUserId2",
        password: "TestPassword",
        email: "testemail2@naver.com",
        nickname: "TestUser",
      })
      .expect(204);

    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUserId2",
        password: "TestPassword3",
        email: "testemail3@naver.com",
        nickname: "TestUser3",
      })
      .expect(409);

    const testUser = await User.findOne({ where: { userId: "TestUserId2" } });
    if (testUser) {
      await User.remove(testUser);
    }
  });

  it("중복된 이메일에 대한 요청 시 409 Conflict 응답", async () => {
    await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUserId4",
        password: "TestPassword4",
        email: "testemail4@naver.com",
        nickname: "TestUser4",
      })
      .expect(204);

    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUserId5",
        password: "TestPassword5",
        email: "testemail4@naver.com",
        nickname: "TestUser5",
      })
      .expect(409);

    const testUser = await User.findOne({ where: { userId: "TestUserId4" } });
    if (testUser) {
      await User.remove(testUser);
    }
  });

  it("생성 규칙을 지키지 않는 아이디 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "Test",
        password: "TestPassword",
        email: "testemail4@naver.com",
        nickname: "TestUser",
      })
      .expect(400);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toContain("생성 규칙에 맞지 않는 아이디입니다.");
  });

  it("생성 규칙을 지키지 않는 비밀번호 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUser8",
        password: "Test",
        email: "testemail8@naver.com",
        nickname: "TestUser8",
      })
      .expect(400);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toContain("생성 규칙에 맞지 않는 비밀번호 입니다.");
  });

  it("생성 규칙을 지키지 않는 이메일 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUser9",
        password: "TestPassword9",
        email: "testemailnaver.com",
        nickname: "TestUser9",
      })
      .expect(400);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toContain("적절하지 않은 이메일 양식입니다.");
  });

  it("빈 아이디로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        password: "TestPassword",
        email: "testemail@naver.com",
        nickname: "TestUser",
      })
      .expect(400);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toContain("아이디는 비어있지 않아야 합니다.");
  });

  it("빈 비밀번호로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUser9",
        email: "testemail@naver.com",
        nickname: "TestUser",
      })
      .expect(400);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toContain("비밀번호는 비어있지 않아야 합니다.");
  });

  it("빈 이메일로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUser9",
        password: "TestPassword",
        nickname: "TestUser",
      })
      .expect(400);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toContain("이메일은 비어있지 않아야 합니다.");
  });

  it("빈 닉네임으로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUser9",
        password: "TestPassword",
        email: "testemail@naver.com",
      })
      .expect(400);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toContain("닉네임은 비어있지 않아야 합니다.");
  });

  it("문자열이 아닌 아이디로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: 36,
        password: "TestPassword",
        email: "testemail@naver.com",
        nickname: "TestUser",
      })
      .expect(400);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toContain("아이디는 문자열이어야 합니다.");
  });

  it("문자열이 아닌 비밀번호로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUser9",
        password: 36,
        email: "testemail@naver.com",
        nickname: "TestUser",
      })
      .expect(400);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toContain("비밀번호는 문자열이어야 합니다.");
  });

  it("문자열이 아닌 이메일로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUser9",
        password: "TestPassword",
        email: 36,
        nickname: "TestUser",
      })
      .expect(400);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toContain("이메일은 문자열이어야 합니다.");
  });

  it("문자열이 아닌 닉네임으로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUser9",
        password: "TestPassword",
        email: "testemail@naver.com",
        nickname: 36,
      })
      .expect(400);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toContain("닉네임은 문자열이어야 합니다.");
  });

  it("20자를 초과하는 닉네임으로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUser9",
        password: "TestPassword",
        email: "testemail@naver.com",
        nickname: "testtesttesttesttesttesttetst",
      })
      .expect(400);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toContain("닉네임은 20자 이하여야 합니다.");
  });
});
