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

  it("/diaries POST 201", () => {
    return request(app.getHttpServer())
      .post("/diaries")
      .send({
        title: "title",
        content: "this is content.",
        point: "1.5,5.5,10.55",
        date: "2023-11-14",
      })
      .expect(201);
  });

  it("/diaries/:uuid  GET 200", async () => {
    const response = await request(app.getHttpServer()).get(
      "/diaries/f5ef12ad-b3bd-4de0-b4ee-92f2265b0e90",
    );
    const body = JSON.parse(response.text);

    expect(body.userId).toBe("jeongmin");
    expect(body.title).toBe("jskim");
    expect(body.content).toBe("this is jskim.");
    expect(body.date).toBe("2023-11-13T15:00:00.000Z");
  });
});
