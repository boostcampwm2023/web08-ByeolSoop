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

describe("[일기 삭제] /diaries/:uuid DELETE e2e 테스트", () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;
  let accessToken: string;
  let diaryUuid: string;

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
    const shapeUuid = defaultShapes.body[0]["uuid"];

    const createDiaryPost = await request(app.getHttpServer())
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

    diaryUuid = createDiaryPost.body.uuid;
  });

  afterAll(async () => {
    await transactionalContext.finish();
    await app.close();
  });

  it("정상 요청 시 200 OK 응답", async () => {
    await request(app.getHttpServer())
      .delete(`/diaries/${diaryUuid}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(204);
  });

  it("액세스 토큰 없이 요청 시 401 Unauthorized 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .delete(`/diaries/${diaryUuid}`)
      .expect(401);

    expect(postResponse.body.message).toBe("비로그인 상태의 요청입니다.");
  });

  it("존재하지 않는 일기에 대한 요청 시 404 Not Found 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .delete(`/diaries/5d4a854d-cd2d-46a8-8adc-acec0270e4dc`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    expect(postResponse.body.message).toContain("존재하지 않는 일기입니다.");
  });

  it("타인의 일기에 대한 요청 시 404 Not Found 응답", async () => {
    const unauthorizedDiaryUuid = "aaaf869f-a822-48dd-8306-be4bac319f75";
    const postResponse = await request(app.getHttpServer())
      .delete(`/diaries/${unauthorizedDiaryUuid}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);

    expect(postResponse.body.message).toContain("존재하지 않는 일기입니다.");
  });
});
