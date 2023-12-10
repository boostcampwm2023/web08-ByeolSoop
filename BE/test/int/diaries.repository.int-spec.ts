import { RedisModule } from "@liaoliaots/nestjs-redis";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { Diary } from "src/diaries/diaries.entity";
import { DiariesModule } from "src/diaries/diaries.module";
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
  let user: User;
  let createdDiary: Diary;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeORMTestConfig),
        DiariesModule,
        RedisModule.forRoot({
          readyLog: true,
          config: {
            host: "223.130.129.145",
            port: 6379,
          },
        }),
      ],
      providers: [DiariesRepository],
    }).compile();

    diariesRepository = moduleFixture.get<DiariesRepository>(DiariesRepository);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();

    user = await User.findOne({ where: { userId: "commonUser" } });
    const shape = await Shape.findOne({
      where: { user: { userId: "commonUser" } },
    });
    const tags = [new Tag(), new Tag()];

    const createDiaryDto = new CreateDiaryDto();
    createDiaryDto.title = "Test Title";
    createDiaryDto.content = "Test Content";
    createDiaryDto.point = "1,1,1";
    (createDiaryDto.date as any) = "2023-11-29";
    createDiaryDto.tags = ["tag1", "tag2"];
    createDiaryDto.shapeUuid = shape.uuid;

    const sentimentDto = new SentimentDto();
    sentimentDto.positiveRatio = 0;
    sentimentDto.negativeRatio = 0;
    sentimentDto.neutralRatio = 100;
    sentimentDto.sentiment = sentimentStatus.NEUTRAL;

    createdDiary = await diariesRepository.createDiary(
      createDiaryDto,
      createDiaryDto.content,
      tags,
      user,
      shape,
      sentimentDto,
    );
  });

  afterEach(async () => {
    await transactionalContext.finish();
  });

  describe("createDiary 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      expect(createdDiary).toBeInstanceOf(Diary);
      expect(createdDiary.title).toBe("Test Title");
    });
  });

  describe("readDiary 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const readDiaryDto = new ReadDiaryDto();
      readDiaryDto.uuid = createdDiary.uuid;

      const result = await diariesRepository.readDiary(readDiaryDto);

      expect(result).toBeInstanceOf(Diary);
      expect(result.title).toBe("Test Title");
    });
  });

  describe("readDiariesByUser 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const result = await diariesRepository.readDiariesByUser(user);

      expect(result[0]).toBeInstanceOf(Diary);
    });
  });

  describe("updateDiary 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const shape = await Shape.findOne({
        where: { user: { userId: "commonUser" } },
      });
      const tags = [new Tag(), new Tag()];

      const updateDiaryDto = new UpdateDiaryDto();
      updateDiaryDto.title = "Test Title";
      updateDiaryDto.content = "Updated Content";
      updateDiaryDto.point = "1,1,1";
      (updateDiaryDto.date as any) = "2023-11-29";
      updateDiaryDto.tags = ["tag1", "tag2"];
      updateDiaryDto.shapeUuid = shape.uuid;
      updateDiaryDto.uuid = createdDiary.uuid;

      const sentimentDto = new SentimentDto();
      sentimentDto.positiveRatio = 0;
      sentimentDto.negativeRatio = 0;
      sentimentDto.neutralRatio = 100;
      sentimentDto.sentiment = sentimentStatus.NEUTRAL;

      const result = await diariesRepository.updateDiary(
        updateDiaryDto,
        updateDiaryDto.content,
        tags,
        user,
        shape,
        sentimentDto,
      );

      expect(result).toBeInstanceOf(Diary);
      expect(result.content).toBe("Updated Content");
    });
  });

  describe("getDiaryByUuid 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const result = await diariesRepository.getDiaryByUuid(createdDiary.uuid);

      expect(result).toBeInstanceOf(Diary);
      expect(result.title).toBe("Test Title");
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
