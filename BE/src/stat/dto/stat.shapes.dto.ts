export class ShapeInfoDto {
  uuid: number;
  count: number;
}

export class StatShapeDto {
  [key: string]: ({ rank: number } & ShapeInfoDto) | {};
}
