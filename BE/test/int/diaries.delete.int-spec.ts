import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { ValidationPipe } from "@nestjs/common";
import { DiariesModule } from "src/diaries/diaries.module";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { TypeOrmModule } from "@nestjs/typeorm";

describe("[일기 삭제] /diaries/:uuid DELETE 통합 테스트", () => {
  let app: INestApplication;
  let accessToken: string;
  let diaryUuid: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig), DiariesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    const signInPost = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "commonUser",
        password: process.env.COMMON_USER_PASS,
      });

    accessToken = signInPost.body.accessToken;

    const createDiaryPost = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
        shapeUuid: "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
      });

    diaryUuid = createDiaryPost.body.uuid;
  });

  afterEach(async () => {
    await app.close();
  });

  it("정상 요청 시 200 OK 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .delete(`/diaries/${diaryUuid}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(204);
  });

  it("액세스 토큰 없이 요청 시 401 Unauthorized 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .delete(`/diaries/${diaryUuid}`)
      .expect(401);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toBe("비로그인 상태의 요청입니다.");
  });

  it("존재하지 않는 일기에 대한 요청 시 404 Not Found 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .delete(`/diaries/5d4a854d-cd2d-46a8-8adc-acec0270e4dc`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toContain("존재하지 않는 일기입니다.");
  });

  // 유저 회원가입 및 로그인 후 글 생성하고 commonUser에서 해당 글에 대해 삭제 요청 보내기
  // it("타인의 일기에 대한 요청 시 404 Not Found 응답", async () => {
  //   const postResponse = await request(app.getHttpServer())
  //     .delete(`/diaries/${diaryUuid}`)
  //     .set("Authorization", `Bearer ${accessToken}`)
  //     .expect(204);

  //   const body = JSON.parse(postResponse.text);

  //   expect(body.message).toContain("존재하지 않는 일기입니다.");
  // });
});
