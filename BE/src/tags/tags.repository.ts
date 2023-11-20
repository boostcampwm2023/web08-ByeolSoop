import { Diary } from "src/diaries/diaries.entity";
import { Tag } from "./tags.entity";

export class TagsRepository {
  async createTag(name: string): Promise<Tag> {
    const tag = await Tag.create({ name: name });
    await tag.save();

    return tag;
  }
}
