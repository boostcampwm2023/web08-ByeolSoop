import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { ValidationPipe } from "@nestjs/common";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;

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
  });

  afterEach(async () => {
    await app.close();
  });

  it("정상 요청 시 201 Created 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
        shapeUuid: "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
      })
      .expect(201);

    const body = JSON.parse(postResponse.text);

    expect(body.uuid.length).toBe(36);
  });

  it("액세스 토큰 없이 요청 시 401 Unauthorized 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .send({
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
        shapeUuid: "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
      })
      .expect(401);

    const body = JSON.parse(postResponse.text);

    expect(body.message).toBe("Unauthorized");
  });

  it("빈 값을 포함한 요청 시 400 Bad Request 응답", async () => {
    let postResponse;
    let body;
    // 제목이 없는 경우
    postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
        shapeUuid: "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
      })
      .expect(400);

    body = JSON.parse(postResponse.text);

    expect(body.message).toContain("제목은 비어있지 않아야 합니다.");

    // 좌표가 없는 경우
    postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "title",
        content: "this is content.",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
        shapeUuid: "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
      })
      .expect(400);

    body = JSON.parse(postResponse.text);

    expect(body.message).toContain("좌표는 비어있지 않아야 합니다.");

    // 날짜가 없는 경우
    postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        tags: ["tagTest", "tagTest2"],
        shapeUuid: "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
      })
      .expect(400);

    body = JSON.parse(postResponse.text);

    expect(body.message).toContain("날짜는 비어있지 않아야 합니다.");

    // 모양 uuid가 없는 경우
    postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
      })
      .expect(400);

    body = JSON.parse(postResponse.text);

    expect(body.message).toContain("모양 uuid는 비어있지 않아야 합니다.");

    // 복수의 데이터가 없는 경우
    postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "title",
        content: "this is content.",
        tags: ["tagTest", "tagTest2"],
      })
      .expect(400);

    body = JSON.parse(postResponse.text);

    expect(body.message).toContain("날짜는 비어있지 않아야 합니다.");
    expect(body.message).toContain("좌표는 비어있지 않아야 합니다.");
    expect(body.message).toContain("모양 uuid는 비어있지 않아야 합니다.");
  });

  it("부적절한 값으로 요청 시 400 Bad Request 응답", async () => {
    let postResponse;
    let body;
    // 문자열이 아닌 제목으로 요청
    postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: 35,
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
        shapeUuid: "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
      })
      .expect(400);

    body = JSON.parse(postResponse.text);

    expect(body.message).toContain("제목은 문자열이어야 합니다.");

    // 문자열이 아닌 내용으로 요청
    postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "title",
        content: 35,
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
        shapeUuid: "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
      })
      .expect(400);

    body = JSON.parse(postResponse.text);

    expect(body.message).toContain("내용은 문자열이어야 합니다.");

    // 문자열이 아닌 좌표로 요청
    postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "title",
        content: "this is content.",
        point: [],
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
        shapeUuid: "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
      })
      .expect(400);

    body = JSON.parse(postResponse.text);

    expect(body.message).toContain("좌표는 문자열이어야 합니다.");

    // 적절하지 않은 좌표 양식의 문자열로 요청
    postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "title",
        content: "this is content.",
        point: "-1.5.5.5.10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
        shapeUuid: "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
      })
      .expect(400);

    body = JSON.parse(postResponse.text);

    expect(body.message).toContain("적절하지 않은 좌표 양식입니다.");

    // 적절하지 않은 날짜 양식의 문자열로 요청
    postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "20231114019",
        tags: ["tagTest", "tagTest2"],
        shapeUuid: "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
      })
      .expect(400);

    body = JSON.parse(postResponse.text);

    expect(body.message).toContain("date must be a valid ISO 8601 date string");

    // 배열 형태가 아닌 태그로 요청
    postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: "tagTest2",
        shapeUuid: "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
      })
      .expect(400);

    body = JSON.parse(postResponse.text);

    expect(body.message).toContain("태그는 배열의 형태여야 합니다.");

    // uuid 양식이 아닌 모양 uuid로 요청
    postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
        shapeUuid: "uuidTest",
      })
      .expect(400);

    body = JSON.parse(postResponse.text);

    expect(body.message).toContain("모양 uuid 값이 uuid 양식이어야 합니다.");
  });
});
