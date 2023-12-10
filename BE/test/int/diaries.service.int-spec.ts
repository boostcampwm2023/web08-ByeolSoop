import { RedisModule } from "@liaoliaots/nestjs-redis";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { Diary } from "src/diaries/diaries.entity";
import { DiariesModule } from "src/diaries/diaries.module";
import { DiariesRepository } from "src/diaries/diaries.repository";
import {
  CreateDiaryDto,
  DeleteDiaryDto,
  UpdateDiaryDto,
} from "src/diaries/dto/diaries.dto";
import { SentimentDto } from "src/diaries/dto/diaries.sentiment.dto";
import { Shape } from "src/shapes/shapes.entity";
import { Tag } from "src/tags/tags.entity";
import { sentimentStatus } from "src/utils/enum";
import { DiariesService } from "src/diaries/diaries.service";
import { TagsRepository } from "src/tags/tags.repository";
import { ShapesRepository } from "src/shapes/shapes.repository";
import { HttpModule, HttpService } from "@nestjs/axios";
import { ReadDiaryDto } from "src/diaries/dto/diaries.read.dto";
import { createCipheriv, createDecipheriv } from "crypto";
import { of } from "rxjs";
import { DataSource } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

describe("DiariesService 통합 테스트", () => {
  let diariesService: DiariesService;
  let tagsRepository: TagsRepository;
  let sentimentDto: SentimentDto;
  let httpService: HttpService;
  let user: User;
  let shape: Shape;
  let createResult: Diary;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;

  jest.mock("rxjs", () => ({
    lastValueFrom: jest.fn().mockResolvedValue({
      data: {
        document: {
          confidence: {
            positive: 0.1,
            neutral: 0.2,
            negative: 0.7,
          },
          sentiment: "negative",
        },
      },
    }),
  }));

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeORMTestConfig),
        HttpModule,
        DiariesModule,
        RedisModule.forRoot({
          readyLog: true,
          config: {
            host: "223.130.129.145",
            port: 6379,
          },
        }),
      ],
      providers: [
        DiariesService,
        DiariesRepository,
        TagsRepository,
        ShapesRepository,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    diariesService = moduleFixture.get<DiariesService>(DiariesService);
    tagsRepository = moduleFixture.get<TagsRepository>(TagsRepository);
    httpService = moduleFixture.get<HttpService>(HttpService);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();

    sentimentDto = new SentimentDto();
    sentimentDto.positiveRatio = 0;
    sentimentDto.negativeRatio = 0;
    sentimentDto.neutralRatio = 100;
    sentimentDto.sentiment = sentimentStatus.NEUTRAL;
    user = await User.findOne({ where: { userId: "commonUser" } });
    shape = await Shape.findOne({
      where: { user: { userId: "commonUser" } },
    });

    jest
      .spyOn(diariesService, "getTags")
      .mockResolvedValueOnce([new Tag(), new Tag()]);
    jest
      .spyOn(diariesService, "getSentiment")
      .mockResolvedValueOnce(sentimentDto);

    const createDiaryDto = new CreateDiaryDto();
    createDiaryDto.title = "Test Title";
    createDiaryDto.content = "Test Content";
    createDiaryDto.point = "1,1,1";
    (createDiaryDto.date as any) = "2023-11-29";
    createDiaryDto.tags = ["tag1", "tag2"];
    createDiaryDto.shapeUuid = shape.uuid;

    createResult = await diariesService.writeDiary(createDiaryDto, user);
  });

  afterEach(async () => {
    await transactionalContext.finish();
    await jest.restoreAllMocks();
  });

  describe("writeDiary 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      expect(createResult).toBeInstanceOf(Diary);
      expect(createResult.title).toBe("Test Title");
      expect(createResult).toMatchObject({
        title: "Test Title",
        content: "f2302664806f9f519404b1d583902d36",
        positiveRatio: 0,
        negativeRatio: 0,
        neutralRatio: 100,
        sentiment: "neutral",
        date: "2023-11-29",
        point: "1,1,1",
        user: { id: 1 },
        shape: { id: 1 },
        deletedDate: null,
      });
    });
  });

  describe("getEncryptedContent 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const content = "Test Content";

      const result = await diariesService.getEncryptedContent(content);
      const decipher = createDecipheriv(
        "aes-256-cbc",
        process.env.CONTENT_SECRET_KEY,
        process.env.CONTENT_IV,
      );
      let decryptedResult = decipher.update(result, "hex", "utf8");
      decryptedResult += decipher.final("utf8");

      expect(decryptedResult).toEqual(content);
    });
  });

  describe("getDecryptedContent 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const content = "Test Content";
      const cipher = createCipheriv(
        "aes-256-cbc",
        process.env.CONTENT_SECRET_KEY,
        process.env.CONTENT_IV,
      );
      let encryptedContent = cipher.update(content, "utf8", "hex");
      encryptedContent += cipher.final("hex");

      const result = await diariesService.getDecryptedContent(encryptedContent);

      expect(result).toEqual(content);
    });
  });

  describe("readDiary 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const readDiaryDto = new ReadDiaryDto();
      readDiaryDto.uuid = createResult.uuid;

      jest
        .spyOn(diariesService, "getDecryptedContent")
        .mockResolvedValue("decrypted");

      const result = await diariesService.readDiary(readDiaryDto);

      expect(result).toBeInstanceOf(Diary);
      expect(result.title).toBe("Test Title");
    });
  });

  describe("readDiariesByUser 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      jest
        .spyOn(diariesService, "getDecryptedContent")
        .mockResolvedValue("decrypted2323");

      const result = await diariesService.readDiariesByUser(user);

      expect(result[0]).toBeInstanceOf(Diary);
    });
  });

  describe("modifyDiary 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const updateDiaryDto = new UpdateDiaryDto();
      updateDiaryDto.title = "Test Title";
      updateDiaryDto.content = "Test Content";
      updateDiaryDto.point = "3,3,3";
      (updateDiaryDto.date as any) = "2023-11-29";
      updateDiaryDto.tags = ["tag1", "tag2"];
      updateDiaryDto.shapeUuid = shape.uuid;
      updateDiaryDto.uuid = createResult.uuid;

      const result = await diariesService.modifyDiary(updateDiaryDto, user);

      expect(result).toBeInstanceOf(Diary);
      expect(result.point).toBe("3,3,3");
    });
  });

  describe("deleteDiary 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const deleteDiaryDto = new DeleteDiaryDto();
      deleteDiaryDto.uuid = createResult.uuid;

      await diariesService.deleteDiary(deleteDiaryDto);
    });
  });

  describe("getTags 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const tagNames = ["tag", "tag"];
      const tag = new Tag();
      tag.name = "tag";

      jest.spyOn(tagsRepository, "getTagByName").mockResolvedValue(tag);
      jest.spyOn(tagsRepository, "createTag").mockResolvedValue(tag);

      const result = await diariesService.getTags(tagNames);

      expect(result[0]).toBeInstanceOf(Tag);
      expect(result[0].name).toBe("tag");
    });
  });

  describe("getSentimentByContent 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const result: any = {
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
        data: {
          document: {
            confidence: {
              positive: 0.1,
              neutral: 0.2,
              negative: 0.7,
            },
            sentiment: "negative",
          },
        },
      };

      jest.spyOn(httpService, "post").mockImplementation(() => of(result));

      const sentimentDto = await diariesService.getSentimentByContent("test");

      expect(sentimentDto).toEqual({
        positiveRatio: 0.1,
        neutralRatio: 0.2,
        negativeRatio: 0.7,
        sentiment: "negative",
      });
    });
  });

  describe("getSentiment 통합 테스트", () => {
    it("1000자 이하 메서드 정상 요청", async () => {
      const result: any = {
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
        data: {
          document: {
            confidence: {
              positive: 0.1,
              neutral: 0.2,
              negative: 0.7,
            },
            sentiment: "negative",
          },
        },
      };

      jest.spyOn(httpService, "post").mockImplementation(() => of(result));

      const sentimentDto = await diariesService.getSentiment("test");

      expect(sentimentDto).toEqual({
        positiveRatio: 0.1,
        neutralRatio: 0.2,
        negativeRatio: 0.7,
        sentiment: "negative",
      });
    });

    it("1000자 초과 메서드 정상 요청", async () => {
      const result: any = {
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
        data: {
          document: {
            confidence: {
              positive: 0.1,
              neutral: 0.2,
              negative: 0.7,
            },
            sentiment: "negative",
          },
        },
      };

      jest.spyOn(httpService, "post").mockImplementation(() => of(result));

      const sentimentDto = await diariesService.getSentiment("a".repeat(1500));

      expect(sentimentDto.negativeRatio).toBeGreaterThan(0.69);
      expect(sentimentDto.negativeRatio).toBeLessThan(0.71);
      expect(sentimentDto.sentiment).toBe("negative");
    });
  });
});
