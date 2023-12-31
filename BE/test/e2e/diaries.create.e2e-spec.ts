import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { ValidationPipe } from "@nestjs/common";
import { DiariesModule } from "src/diaries/diaries.module";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { DataSource } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

describe("[일기 작성] /diaries POST e2e 테스트", () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;
  let accessToken: string;
  let shapeUuid: string;

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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();

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

  afterAll(async () => {
    await transactionalContext.finish();
    await app.close();
  });

  it("정상 요청 시 201 Created 응답", async () => {
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

    const body = postResponse.body;

    expect(body.uuid.length).toBe(36);
  });

  it("액세스 토큰 없이 요청 시 401 Unauthorized 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .send({
        shapeUuid,
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
      })
      .expect(401);

    expect(postResponse.body.message).toBe("비로그인 상태의 요청입니다.");
  });

  it("빈 제목을 포함한 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        shapeUuid,
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
      })
      .expect(400);

    const body = postResponse.body;

    expect(body.message).toContain("제목은 비어있지 않아야 합니다.");
  });

  it("빈 좌표를 포함한 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        shapeUuid,
        title: "title",
        content: "this is content.",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
      })
      .expect(400);

    const body = postResponse.body;

    expect(body.message).toContain("좌표는 비어있지 않아야 합니다.");
  });

  it("빈 날짜를 포함한 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        shapeUuid,
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        tags: ["tagTest", "tagTest2"],
      })
      .expect(400);

    const body = postResponse.body;

    expect(body.message).toContain("날짜는 비어있지 않아야 합니다.");
  });

  it("빈 모양 uuid를 포함한 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
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

    const body = postResponse.body;

    expect(body.message).toContain("모양 uuid는 비어있지 않아야 합니다.");
  });

  it("복수의 데이터가 빈 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "title",
        content: "this is content.",
        tags: ["tagTest", "tagTest2"],
      })
      .expect(400);

    const body = postResponse.body;

    expect(body.message).toContain("날짜는 비어있지 않아야 합니다.");
    expect(body.message).toContain("좌표는 비어있지 않아야 합니다.");
    expect(body.message).toContain("모양 uuid는 비어있지 않아야 합니다.");
  });

  it("문자열이 아닌 제목으로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        shapeUuid,
        title: 35,
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
      })
      .expect(400);

    const body = postResponse.body;

    expect(body.message).toContain("제목은 문자열이어야 합니다.");
  });

  it("문자열이 아닌 내용으로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        shapeUuid,
        title: "title",
        content: 35,
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
      })
      .expect(400);

    const body = postResponse.body;

    expect(body.message).toContain("내용은 문자열이어야 합니다.");
  });

  it("문자열이 아닌 좌표로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        shapeUuid,
        title: "title",
        content: "this is content.",
        point: [],
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
      })
      .expect(400);

    const body = postResponse.body;

    expect(body.message).toContain("좌표는 문자열이어야 합니다.");
  });

  it("적절하지 않은 좌표 양식으로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        shapeUuid,
        title: "title",
        content: "this is content.",
        point: "-1.5.5.5.10.55",
        date: "2023-11-14",
        tags: ["tagTest", "tagTest2"],
      })
      .expect(400);

    const body = postResponse.body;

    expect(body.message).toContain("적절하지 않은 좌표 양식입니다.");
  });

  it("적절하지 않은 날짜 양식으로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        shapeUuid,
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "20231114019",
        tags: ["tagTest", "tagTest2"],
      })
      .expect(400);

    const body = postResponse.body;

    expect(body.message).toContain("date must be a valid ISO 8601 date string");
  });

  it("배열 형태가 아닌 태그로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        shapeUuid,
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
        tags: "tagTest2",
      })
      .expect(400);

    const body = postResponse.body;

    expect(body.message).toContain("태그는 배열의 형태여야 합니다.");
  });

  it("uuid 형태가 아닌 모양 uuid로 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
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

    const body = postResponse.body;

    expect(body.message).toContain("모양 uuid 값이 uuid 양식이어야 합니다.");
  });
});
