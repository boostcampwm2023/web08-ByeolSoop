export class TagInfo {
  id: number;
  count: number;
  tag: string;
}

export class StatTagDto {
  [key: string]: { rank: number } & TagInfo;
}
