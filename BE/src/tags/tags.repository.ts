import { Tag } from "./tags.entity";
import { NotFoundException } from "@nestjs/common";

export class TagsRepository {
  async createTag(name: string): Promise<Tag> {
    const tag = Tag.create({ name });
    await tag.save();

    return tag;
  }

  async getTagByName(name: string): Promise<Tag> {
    const found = await Tag.findOne({ where: { name } });
    if (!found) {
      throw new NotFoundException(`Can't find Tag with name: [${name}]`);
    }
    return found;
  }
}
