import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { Diary } from "src/diaries/diaries.entity";
import { DiariesRepository } from "src/diaries/diaries.repository";
import { CreateDiaryDto, UpdateDiaryDto } from "src/diaries/dto/diaries.dto";
import { ReadDiaryDto } from "src/diaries/dto/diaries.read.dto";
import { SentimentDto } from "src/diaries/dto/diaries.sentiment.dto";
import { Shape } from "src/shapes/shapes.entity";
import { Tag } from "src/tags/tags.entity";
import { sentimentStatus } from "src/utils/enum";
import { NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

describe("DiariesRepository 통합 테스트", () => {
  let diariesRepository: DiariesRepository;
  let createdDiary: Diary;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig)],
      providers: [DiariesRepository],
    }).compile();

    diariesRepository = moduleFixture.get<DiariesRepository>(DiariesRepository);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();
  });

  afterEach(async () => {
    await transactionalContext.finish();
  });

  describe("createDiary 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const newUser = await User.findOne({ where: { userId: "newUser" } });
      const shape = await Shape.findOne({ where: { id: 2 } });
      const tags = [await Tag.findOne({ where: { name: "Naver" } })];

      const createDiaryDto = new CreateDiaryDto();
      createDiaryDto.title = "Test Title";
      createDiaryDto.content = "Test Content";
      createDiaryDto.point = "1,1,1";
      createDiaryDto.date = new Date("2023-11-29");
      createDiaryDto.tags = ["Naver"];
      createDiaryDto.shapeUuid = shape.uuid;

      const sentimentDto = new SentimentDto(0, 100, 0, sentimentStatus.NEUTRAL);

      createdDiary = await diariesRepository.createDiary(
        createDiaryDto,
        createDiaryDto.content,
        tags,
        newUser,
        shape,
        sentimentDto,
      );

      expect(createdDiary).toBeInstanceOf(Diary);
      expect(createdDiary).toMatchObject({
        title: "Test Title",
        positiveRatio: 0,
        negativeRatio: 0,
        neutralRatio: 100,
        sentiment: "neutral",
        date: new Date("2023-11-29"),
        tags: [{ id: 13, name: "Naver" }],
      });
      expect(createdDiary.shape.id).toBe(2);
      expect(createdDiary.user.id).toBe(3);
    });
  });

  describe("readDiary 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const readDiaryDto = new ReadDiaryDto();
      readDiaryDto.uuid = "0c388311-61c4-41ad-8d4d-b7b1ce075ef2";

      const result = await diariesRepository.readDiary(readDiaryDto);

      expect(result).toBeInstanceOf(Diary);
      expect(result).toMatchObject({
        title: "부정 1",
        uuid: "0c388311-61c4-41ad-8d4d-b7b1ce075ef2",
        positiveRatio: 0.00949954,
        negativeRatio: 99.978,
        neutralRatio: 0.0124967,
        sentiment: "negative",
        date: new Date("2023-03-02T15:00:00.000Z"),
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
      const diaries = await diariesRepository.readDiariesByUser(naverUser);

      expect(diaries[0]).toBeInstanceOf(Diary);
      expect(diaries).toHaveLength(3);

      const expectedTitles = [
        "긍정 네이버 1",
        "긍정 네이버 2",
        "긍정 네이버 3",
      ];
      expect(diaries.map((diary) => diary.title)).toEqual(
        expect.arrayContaining(expectedTitles),
      );
    });
  });

  describe("updateDiary 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const oldUser = await User.findOne({ where: { userId: "oldUser" } });
      const shape = await Shape.findOne({ where: { id: 3 } });
      const tags = [await Tag.findOne({ where: { name: "Naver" } })];

      const updateDiaryDto = new UpdateDiaryDto();
      updateDiaryDto.title = "Test Title";
      updateDiaryDto.content = "Updated Content";
      updateDiaryDto.point = "1,1,1";
      updateDiaryDto.date = new Date("2023-11-29");
      updateDiaryDto.tags = ["Naver"];
      updateDiaryDto.shapeUuid = shape.uuid;
      updateDiaryDto.uuid = "0c388311-61c4-41ad-8d4d-b7b1ce075ef2";

      const sentimentDto = new SentimentDto(
        80,
        20,
        0,
        sentimentStatus.POSITIVE,
      );

      const result = await diariesRepository.updateDiary(
        updateDiaryDto,
        updateDiaryDto.content,
        tags,
        oldUser,
        shape,
        sentimentDto,
      );

      expect(result).toBeInstanceOf(Diary);
      expect(result).toMatchObject({
        title: "Test Title",
        content: "Updated Content",
        uuid: "0c388311-61c4-41ad-8d4d-b7b1ce075ef2",
        positiveRatio: 80,
        neutralRatio: 20,
        negativeRatio: 0,
        sentiment: "positive",
        date: new Date("2023-11-29"),
        tags: [{ id: 13, name: "Naver" }],
      });
    });
  });

  describe("getDiaryByUuid 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const uuid = "c8cd1721-d553-430d-b3cd-7246967445d4";
      const result = await diariesRepository.getDiaryByUuid(uuid);

      expect(result).toBeInstanceOf(Diary);
      expect(result).toMatchObject({
        id: 5,
        uuid: "c8cd1721-d553-430d-b3cd-7246967445d4",
        title: "긍정 5",
        positiveRatio: 99.9786,
        negativeRatio: 0.0180166,
        neutralRatio: 0.00338173,
        sentiment: "positive",
        date: new Date("2023-01-02T15:00:00.000Z"),
      });
      expect(result.user.id).toBe(2);
      expect(result.shape.id).toBe(2);
      expect(result.tags).toEqual([
        { id: 1, name: "Old" },
        { id: 3, name: "긍정" },
        { id: 7, name: "1월" },
      ]);
    });

    it("존재하지 않는 일기 uuid에 대한 요청", async () => {
      try {
        await diariesRepository.getDiaryByUuid("not uuid");
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
