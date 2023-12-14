import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { Diary } from "src/diaries/diaries.entity";
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
import { UsersRepository } from "src/auth/users.repository";
import { NotFoundException } from "@nestjs/common";

describe("DiariesService 통합 테스트", () => {
  let diariesService: DiariesService;
  let diariesRepository: DiariesRepository;
  let sentimentDto: SentimentDto;
  let httpService: HttpService;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig), HttpModule],
      providers: [
        DiariesService,
        DiariesRepository,
        TagsRepository,
        ShapesRepository,
        UsersRepository,
      ],
    }).compile();

    diariesService = moduleFixture.get<DiariesService>(DiariesService);
    diariesRepository = moduleFixture.get<DiariesRepository>(DiariesRepository);
    httpService = moduleFixture.get<HttpService>(HttpService);
    dataSource = moduleFixture.get<DataSource>(DataSource);

    sentimentDto = new SentimentDto(0, 100, 0, sentimentStatus.NEUTRAL);

    jest
      .spyOn(diariesService, "getSentiment")
      .mockResolvedValueOnce(sentimentDto);

    const mockData: any = {
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
      data: {
        document: {
          confidence: {
            positive: 10.0,
            neutral: 20.0,
            negative: 70.0,
          },
          sentiment: "negative",
        },
      },
    };
    jest.spyOn(httpService, "post").mockImplementation(() => of(mockData));
  });

  beforeEach(async () => {
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();
  });

  afterEach(async () => {
    await transactionalContext.finish();
  });

  afterAll(async () => {
    await jest.restoreAllMocks();
  });

  describe("writeDiary 통합 테스트", () => {
    it("신규 유저 메서드 정상 요청", async () => {
      const newUser = await User.findOne({ where: { userId: "newUser" } });
      const shape = await Shape.findOne({ where: { id: 2 } });

      const createDiaryDto = new CreateDiaryDto();
      createDiaryDto.title = "Test Title";
      createDiaryDto.content = "Test Content";
      createDiaryDto.point = "1,1,1";
      createDiaryDto.date = new Date("2023-11-29");
      createDiaryDto.tags = ["Naver"];
      createDiaryDto.shapeUuid = shape.uuid;

      const result = await diariesService.writeDiary(createDiaryDto, newUser);
      expect(result).toBeInstanceOf(Diary);
      expect(result).toMatchObject({
        title: "Test Title",
        positiveRatio: 0,
        negativeRatio: 0,
        neutralRatio: 100,
        sentiment: "neutral",
        date: new Date("2023-11-29"),
        point: "1,1,1",
        user: { id: 3 },
        shape: { id: 2 },
        deletedDate: null,
      });

      const decryptedContent = await diariesService.getDecryptedContent(
        result.content,
      );
      expect(decryptedContent).toBe("Test Content");
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
      readDiaryDto.uuid = "0c388311-61c4-41ad-8d4d-b7b1ce075ef2";

      const result = await diariesService.readDiary(readDiaryDto);

      expect(result).toBeInstanceOf(Diary);
      expect(result).toMatchObject({
        title: "부정 1",
        content: "너무 싫어",
        uuid: "0c388311-61c4-41ad-8d4d-b7b1ce075ef2",
        positiveRatio: 0.00949954,
        negativeRatio: 99.978,
        neutralRatio: 0.0124967,
        sentiment: "negative",
        date: new Date("2023-03-03"),
        tags: [
          { id: 1, name: "Old" },
          { id: 5, name: "9월" },
          { id: 8, name: "중립" },
        ],
      });
    });
  });

  describe("readDiariesByUser 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const naverUser = await User.findOne({ where: { userId: "naverUser" } });
      const diaries = await diariesService.readDiariesByUser(naverUser);

      const expectedValues = [
        { title: "긍정 네이버 1", content: "네이버는 너무 좋아" },
        { title: "긍정 네이버 2", content: "네이버는 너무 행복해" },
        { title: "긍정 네이버 3", content: "행복해" },
      ];

      expect(
        diaries.map((diary) => ({
          title: diary.title,
          content: diary.content,
        })),
      ).toEqual(expectedValues);
    });
  });

  describe("modifyDiary 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const oldUser = await User.findOne({ where: { userId: "oldUser" } });
      const shape = await Shape.findOne({ where: { id: 3 } });

      const updateDiaryDto = new UpdateDiaryDto();
      updateDiaryDto.title = "Test Title";
      updateDiaryDto.content = "Updated Content";
      updateDiaryDto.point = "3,3,3";
      updateDiaryDto.date = new Date("2023-11-29");
      updateDiaryDto.tags = ["Naver"];
      updateDiaryDto.shapeUuid = shape.uuid;
      updateDiaryDto.uuid = "0c388311-61c4-41ad-8d4d-b7b1ce075ef2";

      const result = await diariesService.modifyDiary(updateDiaryDto, oldUser);

      expect(result).toBeInstanceOf(Diary);
      expect(result).toMatchObject({
        title: "Test Title",
        uuid: "0c388311-61c4-41ad-8d4d-b7b1ce075ef2",
        positiveRatio: 10,
        neutralRatio: 20,
        negativeRatio: 70,
        sentiment: "negative",
        date: new Date("2023-11-29"),
        tags: [{ id: 13, name: "Naver" }],
        point: "3,3,3",
      });

      const decryptedContent = await diariesService.getDecryptedContent(
        result.content,
      );
      expect(decryptedContent).toBe("Updated Content");
    });
  });

  describe("deleteDiary 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const deleteDiaryDto = new DeleteDiaryDto();
      deleteDiaryDto.uuid = "0c388311-61c4-41ad-8d4d-b7b1ce075ef2";

      await diariesService.deleteDiary(deleteDiaryDto);

      try {
        await diariesRepository.getDiaryByUuid(deleteDiaryDto.uuid);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe("존재하지 않는 일기입니다.");
      }
    });
  });

  describe("getTags 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const tagNames = ["3월", "5월", "7월", "13월"];

      const result = await diariesService.getTags(tagNames);

      expect(result[0]).toBeInstanceOf(Tag);
      expect(result.map((tag) => tag.name)).toEqual(
        expect.arrayContaining(tagNames),
      );
    });
  });

  describe("getSentimentByContent 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const sentimentDto = await diariesService.getSentimentByContent("test");

      expect(sentimentDto).toEqual({
        positiveRatio: 10,
        neutralRatio: 20,
        negativeRatio: 70,
        sentiment: "negative",
      });
    });
  });

  describe("getSentiment 통합 테스트", () => {
    it("1000자 이하 메서드 정상 요청", async () => {
      const sentimentDto = await diariesService.getSentiment("test");

      expect(sentimentDto).toEqual({
        positiveRatio: 10,
        neutralRatio: 20,
        negativeRatio: 70,
        sentiment: "negative",
      });
    });

    it("1000자 초과 메서드 정상 요청", async () => {
      const sentimentDto = await diariesService.getSentiment("a".repeat(1500));

      expect(sentimentDto.negativeRatio).toBeGreaterThan(69);
      expect(sentimentDto.negativeRatio).toBeLessThan(71);
      expect(sentimentDto.sentiment).toBe("negative");
    });
  });
});
