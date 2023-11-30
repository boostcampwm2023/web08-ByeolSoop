export class TagInfoDto {
  id: number;
  count: number;
  tag: string;
}

export class StatTagDto {
  [key: string]: ({ rank: number } & TagInfoDto) | {};
}
