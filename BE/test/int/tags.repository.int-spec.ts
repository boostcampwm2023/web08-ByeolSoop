import { RedisModule } from "@liaoliaots/nestjs-redis";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { TagsRepository } from "src/tags/tags.repository";
import { TagsModule } from "src/tags/tags.module";
import { Tag } from "src/tags/tags.entity";
import { NotFoundException } from "@nestjs/common";

describe("UsersRepository 통합 테스트", () => {
  let tagsRepository: TagsRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeORMTestConfig),
        TagsModule,
        RedisModule.forRoot({
          readyLog: true,
          config: {
            host: "223.130.129.145",
            port: 6379,
          },
        }),
      ],
      providers: [TagsRepository],
    }).compile();

    tagsRepository = moduleFixture.get<TagsRepository>(TagsRepository);
  });

  describe("createTags 메서드", () => {
    it("메서드 정상 요청", async () => {
      const tagName = "tagTest";

      const result = await tagsRepository.createTag(tagName);

      expect(result).toBeInstanceOf(Tag);
      expect(result.name).toBe("tagTest");
    });
  });

  describe("getTagByName 메서드", () => {
    it("메서드 정상 요청", async () => {
      const tagName = "tagTest";

      await tagsRepository.createTag(tagName);
      const result = await tagsRepository.getTagByName(tagName);

      expect(result).toBeInstanceOf(Tag);
      expect(result.name).toBe("tagTest");
    });

    it("존재하지 않는 태그명으로 요청 시 실패", async () => {
      const tagName = "tagTest2";

      const result = await tagsRepository.getTagByName(tagName);

      try {
        await tagsRepository.getTagByName(tagName);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
