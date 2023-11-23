import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { ValidationPipe } from "@nestjs/common";

describe("일기 CRUD e2e 테스트", () => {
  let app: INestApplication;
  let accessToken: string;
  let shapeUuid: string;
  const userId = "commonUser";

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

    const defaultShapes = await request(app.getHttpServer())
      .get("/shapes/default")
      .set("Authorization", `Bearer ${accessToken}`);
    shapeUuid = defaultShapes.body[0]["uuid"];
  });

  afterEach(async () => {
    await app.close();
  });

  it("/diaries API 테스트", async () => {
    // 일기 생성
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        shapeUuid,
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
      })
      .expect(201);

    const diaryUuid = JSON.parse(postResponse.text).uuid;

    // 생성한 일기 조회
    const getResponse = await request(app.getHttpServer())
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

    expect(getResponse.body).toEqual(expectedResponse);

    // 생성한 일기 수정
    await request(app.getHttpServer())
      .put("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        uuid: diaryUuid,
        shapeUuid,
        title: "update title",
        content: "this is content!",
        point: "1.5,5.5,10.55",
        date: "2023-12-14",
        tags: ["tagTest", "tagTest2", "tagTest3"],
      })
      .expect(204);

    // 수정된 일기 조회
    const getUpdatedResponse = await request(app.getHttpServer())
      .get(`/diaries/${diaryUuid}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    const expectedUpdatedResponse = {
      uuid: diaryUuid,
      userId,
      shapeUuid,
      title: "update title",
      content: "this is content!",
      date: "2023-12-14T00:00:00.000Z",
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
      tags: expect.arrayContaining(["tagTest", "tagTest2", "tagTest3"]),
    };

    expect(getUpdatedResponse.body).toEqual(expectedUpdatedResponse);

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/diaries/${diaryUuid}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(204);
  });
});
