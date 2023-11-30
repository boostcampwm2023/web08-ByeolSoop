import { Diary } from "src/diaries/diaries.entity";
import { ReadDiaryResponseDto } from "src/diaries/dto/diaries.read.dto";
import { ReadLineDto } from "src/lines/dto/lines.dto";
import { Line } from "src/lines/lines.entity";
import { Tag } from "src/tags/tags.entity";

export function getTagNames(tags: Tag[]): string[] {
  const tagNames = tags.map((tag) => tag.name);
  return tagNames;
}

export function getCoordinate(point: string): {
  x: number;
  y: number;
  z: number;
} {
  const [x, y, z] = point.split(",");
  return {
    x: parseFloat(x),
    y: parseFloat(y),
    z: parseFloat(z),
  };
}

export function getReadResponseDtoFormat(diary: Diary): ReadDiaryResponseDto {
  const tagNames = getTagNames(diary.tags);
  const coordinate = getCoordinate(diary.point);

  return {
    coordinate,
    uuid: diary.uuid,
    userId: diary.user.userId,
    title: diary.title,
    content: diary.content,
    date: diary.date,
    tags: tagNames,
    emotion: {
      positive: diary.positiveRatio,
      neutral: diary.neutralRatio,
      negative: diary.negativeRatio,
      sentiment: diary.sentiment,
    },
    shapeUuid: diary.shape.uuid,
  };
}

export function getReadLineDtoFormat(line: Line): ReadLineDto {
  const { id, firstDiary, secondDiary } = line;

  return {
    id,
    first: {
      uuid: firstDiary.uuid,
      coordinate: getCoordinate(firstDiary.point),
    },
    second: {
      uuid: secondDiary.uuid,
      coordinate: getCoordinate(secondDiary.point),
    },
  };
}
