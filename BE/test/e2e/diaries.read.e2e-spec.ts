import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { ValidationPipe } from "@nestjs/common";
import { UsersRepository } from "src/auth/users.repository";
import { DiariesModule } from "src/diaries/diaries.module";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShapesModule } from "src/shapes/shapes.module";
import { RedisModule } from "@liaoliaots/nestjs-redis";

describe("[일기 조회] /diaries/:uuid GET e2e 테스트", () => {
  let app: INestApplication;
  let accessToken: string;
  let diaryUuid: string;
  let shapeUuid: string;
  const userId = "commonUser";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeORMTestConfig),
        RedisModule.forRoot({
          readyLog: true,
          config: {
            host: "223.130.129.145",
            port: 6379,
          },
        }),
        DiariesModule,
        ShapesModule,
      ],
      providers: [UsersRepository],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    const signInPost = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId,
        password: process.env.COMMON_USER_PASS,
      });

    accessToken = signInPost.body.accessToken;

    const defaultShapes = await request(app.getHttpServer())
      .get("/shapes/default")
      .set("Authorization", `Bearer ${accessToken}`);
    shapeUuid = defaultShapes.body[0]["uuid"];

    const createResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        shapeUuid,
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
      });

    diaryUuid = createResponse.body.uuid;
  });

  afterAll(async () => {
    await app.close();
  });

  it("정상 요청 시 200 OK 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .get(`/diaries/${diaryUuid}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    const expectedResponse = {
      uuid: diaryUuid,
      userId,
      shapeUuid,
      title: "title",
      content: "this is content.",
      date: "2023-11-14T00:00:00.000Z",
      emotion: {
        positive: 0,
        neutral: 0,
        negative: 100,
        sentiment: "neutral",
      },
      coordinate: {
        x: 1.5,
        y: 5.5,
        z: 10.55,
      },
      tags: expect.arrayContaining(["tagTest", "tagTest2"]),
    };

    expect(postResponse.body.title).toEqual(expectedResponse.title);
    expect(postResponse.body.content).toEqual(expectedResponse.content);
    expect(postResponse.body.date).toEqual(expectedResponse.date);
    expect(postResponse.body.coordinate).toEqual(expectedResponse.coordinate);
  });

  it("액세스 토큰 없이 요청 시 401 Unauthorized 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .get(`/diaries/${diaryUuid}`)
      .expect(401);

    const body = postResponse.body;

    expect(body.message).toBe("비로그인 상태의 요청입니다.");
  });

  it("만료된 토큰 요청 시 401 Unauthorized 응답", async () => {
    const expiredToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJqZW9uZ21pbjUiLCJpYXQiOjE3MDAzOTI2MDEsImV4cCI6MTcwMDM5NjIwMX0.9g397cBTpk7zvaNTB77c3qcB9JUtGpqcNet0mYVijY";
    const postResponse = await request(app.getHttpServer())
      .get(`/diaries/${diaryUuid}`)
      .set("Authorization", `Bearer ${expiredToken}`)
      .expect(401);

    const body = postResponse.body;
    expect(
      postResponse.body.message === "토큰이 만료되었습니다." ||
        postResponse.body.message === "유효하지 않은 토큰입니다.",
    ).toBeTruthy();
  });

  it("존재하지 않는 일기 조회 요청 시 404 Not Found 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .get(`/diaries/${shapeUuid}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    expect(postResponse.body).toEqual({
      error: "Not Found",
      message: "존재하지 않는 일기입니다.",
      statusCode: 404,
    });
  });

  // 유저 회원가입 및 로그인 후 글 생성하고 commonUser에서 해당 글에 대해 조회 요청 보내기
  // it("타인의 일기에 대한 요청 시 404 Not Found 응답", async () => {
  //   const postResponse = await request(app.getHttpServer())
  //     .get(`/diaries/${unauthorizedDiaryUuid}`)
  //     .set("Authorization", `Bearer ${accessToken}`)
  //     .expect(404);

  //   const body = JSON.parse(postResponse.text);

  //   expect(postResponse.body).toEqual({
  //     error: "Not Found",
  //     message: "존재하지 않는 일기입니다.",
  //     statusCode: 404,
  //   });
  // });
});
