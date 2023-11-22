import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { ValidationPipe } from "@nestjs/common";
import { UsersRepository } from "src/users/users.repository";

describe("[일기 조회] /diaries/:uuid (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let diaryUuid: string;
  let shapeUuid: string;
  const userId = "commonUser";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

    expect(postResponse.body).toEqual(expectedResponse);
  });

  it("액세스 토큰 없이 요청 시 401 Unauthorized 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .get(`/diaries/${diaryUuid}`)
      .expect(401);

    const body = postResponse.body;

    expect(body.message).toBe("Unauthorized");
  });

  it("만료된 토큰 요청 시 401 Unauthorized 응답", async () => {
    const expiredToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJqZW9uZ21pbjUiLCJpYXQiOjE3MDAzOTI2MDEsImV4cCI6MTcwMDM5NjIwMX0.9g397cBTpk7zvaNTB77c3qcB9JUtGpqcNet0mYVijY";
    const postResponse = await request(app.getHttpServer())
      .get(`/diaries/${diaryUuid}`)
      .set("Authorization", `Bearer ${expiredToken}`)
      .expect(401);

    const body = postResponse.body;

    expect(body.message).toBe("Unauthorized");
  });
});
