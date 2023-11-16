import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMTestConfig } from "src/configs/typeorm.config";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig), AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("/diaries POST 201", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .send({
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
      })
      .expect(201);

    const createdDiaryUuid = postResponse.body.uuid;

    await request(app.getHttpServer())
      .delete(`/diaries/${createdDiaryUuid}`)
      .expect(200);
  });

  it("/diaries/:uuid  GET 200", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .send({
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
      });
    const createdDiaryUuid = postResponse.body.uuid;

    const getResponse = await request(app.getHttpServer()).get(
      `/diaries/${createdDiaryUuid}`,
    );
    const body = JSON.parse(getResponse.text);

    expect(body.userId).toBe("jeongmin");
    expect(body.title).toBe("title");
    expect(body.content).toBe("this is content.");
    expect(body.date).toBe("2023-11-14T00:00:00.000Z");

    await request(app.getHttpServer())
      .delete(`/diaries/${createdDiaryUuid}`)
      .expect(200);
  });

  it("/diaries  PUT 200", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .send({
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
      });

    const createdDiaryUuid = postResponse.body.uuid;

    const putResponse = await request(app.getHttpServer())
      .put("/diaries")
      .send({
        uuid: createdDiaryUuid,
        title: "업데이트 확인",
        content: "this is content222.",
        date: "2023-11-18",
        shapeUuid: "test",
      });
    const body = putResponse.body;

    expect(body.title).toBe("업데이트 확인");
    expect(atob(body.content)).toBe("this is content222.");
    expect(body.date).toBe("2023-11-18");

    await request(app.getHttpServer())
      .delete(`/diaries/${createdDiaryUuid}`)
      .expect(200);
  });

  it("/diaries  DELETE 200", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/diaries")
      .send({
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
      });

    const createdDiaryUuid = postResponse.body.uuid;

    await request(app.getHttpServer())
      .delete(`/diaries/${createdDiaryUuid}`)
      .expect(200);
  });
});
