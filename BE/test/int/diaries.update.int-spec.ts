import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { ValidationPipe } from "@nestjs/common";
import { UsersRepository } from "src/users/users.repository";
import { DiariesModule } from "src/diaries/diaries.module";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShapesModule } from "src/shapes/shapes.module";

describe("[일기 수정] /diaries PUT (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let diaryUuid: string;
  let shapeUuid: string;
  const userId = "commonUser";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeORMTestConfig),
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

  it("정상 요청 시 204 No Content 응답", async () => {
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

    const expectedResponse = {
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

    const postResponse = await request(app.getHttpServer())
      .get(`/diaries/${diaryUuid}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(postResponse.body).toEqual(expectedResponse);
  });

  it("액세스 토큰 없이 요청 시 401 Unauthorized 응답", async () => {
    await request(app.getHttpServer())
      .put("/diaries")
      .send({
        uuid: diaryUuid,
        shapeUuid,
        title: "update title",
        content: "this is content!",
        point: "1.5,5.5,10.55",
        date: "2023-12-14",
        tags: ["tagTest", "tagTest2", "tagTest3"],
      })
      .expect(401);

    const postResponse = await request(app.getHttpServer())
      .get(`/diaries/${diaryUuid}`)
      .expect(401);

    expect(postResponse.body).toEqual({
      error: "Unauthorized",
      message: "비로그인 상태의 요청입니다.",
      statusCode: 401,
    });
  });

  it("만료된 토큰 요청 시 401 Unauthorized 응답", async () => {
    const expiredToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjb21tb25Vc2VyIiwiaWF0IjoxNzAwNjUxMDUxLCJleHAiOjE3MDA2NTQ2NTF9.kJlDPs8XICWA8fhuP8rT5lvYqKBsqp86hMmI-txmL54";
    const postResponse = await request(app.getHttpServer())
      .put("/diaries")
      .send({
        uuid: diaryUuid,
        shapeUuid,
        title: "update title",
        content: "this is content!",
        point: "1.5,5.5,10.55",
        date: "2023-12-14",
        tags: ["tagTest", "tagTest2", "tagTest3"],
      })
      .set("Authorization", `Bearer ${expiredToken}`)
      .expect(401);

    expect(
      postResponse.body.message === "토큰이 만료되었습니다." ||
        postResponse.body.message === "유효하지 않은 토큰입니다",
    ).toBeTruthy();
  });

  it("유효하지 않은 토큰 요청 시 401 Unauthorized 응답", async () => {
    const expiredToken =
      "1yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjb21tb25Vc2VyIiwiaWF0IjoxNzAwNjUxMDUxLCJleHAiOjE3MDA2NTQ2NTF9.kJlDPs8XICWA8fhuP8rT5lvYqKBsqp86hMmI-txmL54";
    const postResponse = await request(app.getHttpServer())
      .put("/diaries")
      .send({
        uuid: diaryUuid,
        shapeUuid,
        title: "update title",
        content: "this is content!",
        point: "1.5,5.5,10.55",
        date: "2023-12-14",
        tags: ["tagTest", "tagTest2", "tagTest3"],
      })
      .set("Authorization", `Bearer ${expiredToken}`)
      .expect(401);

    expect(postResponse.body).toEqual({
      error: "Unauthorized",
      message: "유효하지 않은 토큰입니다.",
      statusCode: 401,
    });
  });

  it("존재하지 않는 일기 조회 요청 시 404 Not Found 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .put("/diaries")
      .send({
        uuid: shapeUuid,
        shapeUuid,
        title: "update title",
        content: "this is content!",
        point: "1.5,5.5,10.55",
        date: "2023-12-14",
        tags: ["tagTest", "tagTest2", "tagTest3"],
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    expect(postResponse.body).toEqual({
      error: "Not Found",
      message: "존재하지 않는 일기입니다.",
      statusCode: 404,
    });
  });

  it("빈 값을 포함한 요청 시 400 Bad Request 응답", async () => {
    let postResponse;

    // uuid가 없는 경우
    postResponse = await request(app.getHttpServer())
      .put("/diaries")
      .send({
        shapeUuid,
        title: "title",
        content: "this is content.",
        date: "2023-11-14",
        point: "1.5,5.5,10.55",
        tags: ["tagTest", "tagTest2"],
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(400);

    expect(postResponse.body.message).toContain(
      "일기 uuid는 비어있지 않아야 합니다.",
    );

    // 제목이 없는 경우
    postResponse = await request(app.getHttpServer())
      .put("/diaries")
      .send({
        uuid: diaryUuid,
        shapeUuid,
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(400);

    expect(postResponse.body.message).toContain(
      "제목은 비어있지 않아야 합니다.",
    );

    // 좌표가 없는 경우
    postResponse = await request(app.getHttpServer())
      .put("/diaries")
      .send({
        uuid: diaryUuid,
        shapeUuid,
        title: "title",
        content: "this is content.",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(400);

    expect(postResponse.body.message).toContain(
      "좌표는 비어있지 않아야 합니다.",
    );

    // 날짜가 없는 경우
    postResponse = await request(app.getHttpServer())
      .put("/diaries")
      .send({
        uuid: diaryUuid,
        shapeUuid,
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        tags: ["tagTest", "tagTest2"],
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(400);

    expect(postResponse.body.message).toContain(
      "날짜는 비어있지 않아야 합니다.",
    );

    // 모양 uuid가 없는 경우
    postResponse = await request(app.getHttpServer())
      .put("/diaries")
      .send({
        uuid: diaryUuid,
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(400);

    expect(postResponse.body.message).toContain(
      "모양 uuid는 비어있지 않아야 합니다.",
    );

    // 복수의 데이터가 없는 경우
    postResponse = await request(app.getHttpServer())
      .put("/diaries")
      .send({
        title: "title",
        content: "this is content.",
        tags: ["tagTest", "tagTest2"],
      })
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(400);

    expect(postResponse.body.message).toContain(
      "날짜는 비어있지 않아야 합니다.",
    );
    expect(postResponse.body.message).toContain(
      "좌표는 비어있지 않아야 합니다.",
    );
    expect(postResponse.body.message).toContain(
      "모양 uuid는 비어있지 않아야 합니다.",
    );
  });
});
// 유저 회원가입 및 로그인 후 글 생성하고 commonUser에서 해당 글에 대해 조회 요청 보내기
// it("타인의 일기에 대한 요청 시 404 Not Found 응답", async () => {
//   const postResponse = await request(app.getHttpServer())
//     .get(`/diaries/${unauthorizedDiaryUuid}`)
//     .set("Authorization", `Bearer ${accessToken}`)
//     .expect(404);

//   co

//   expect(postResponse.body).toEqual({
//     error: "Not Found",
//     message: "존재하지 않는 일기입니다.",
//     statusCode: 404,
//   });
// });
