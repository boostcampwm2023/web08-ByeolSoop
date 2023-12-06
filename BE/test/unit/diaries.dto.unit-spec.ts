import { validate } from "class-validator";
import { ReadDiaryDto } from "../../src/diaries/dto/diaries.read.dto";
import {
  CreateDiaryDto,
  DeleteDiaryDto,
  UpdateDiaryDto,
} from "../../src/diaries/dto/diaries.dto";

describe("CreateDiaryDto 단위 테스트", () => {
  let createDiaryDto: CreateDiaryDto;

  beforeEach(() => {
    createDiaryDto = new CreateDiaryDto();
    createDiaryDto.title = "validTitle";
    createDiaryDto.content = "validContent";
    createDiaryDto.point = "1,2,3";
    (createDiaryDto.date as any) = "2023-11-29";
    createDiaryDto.tags = ["tag1", "tag2"];
    createDiaryDto.shapeUuid = "3d991e7f-8423-4e44-9d8e-3f9f1ebaae4a";
  });

  it("정상 요청 시 성공", async () => {
    const errors = await validate(createDiaryDto);

    expect(errors).toHaveLength(0);
  });

  it("빈 제목으로 요청 시 실패", async () => {
    createDiaryDto.title = "";

    const errors = await validate(createDiaryDto);
    const titleError = errors.find((error) => error.property === "title");

    expect(titleError.constraints).toHaveProperty("isNotEmpty");
    expect(titleError.constraints.isNotEmpty).toEqual(
      "제목은 비어있지 않아야 합니다.",
    );
  });

  it("문자열이 아닌 제목으로 요청 시 실패", async () => {
    (createDiaryDto.title as any) = 123;

    const errors = await validate(createDiaryDto);
    const titleError = errors.find((error) => error.property === "title");

    expect(titleError.constraints).toHaveProperty("isString");
    expect(titleError.constraints.isString).toEqual(
      "제목은 문자열이어야 합니다.",
    );
  });

  it("문자열이 아닌 내용으로 요청 시 실패", async () => {
    (createDiaryDto.content as any) = 123;

    const errors = await validate(createDiaryDto);
    const contentError = errors.find((error) => error.property === "content");

    expect(contentError.constraints).toHaveProperty("isString");
    expect(contentError.constraints.isString).toEqual(
      "내용은 문자열이어야 합니다.",
    );
  });

  it("빈 좌표로 요청 시 실패", async () => {
    createDiaryDto.point = "";

    const errors = await validate(createDiaryDto);
    const pointError = errors.find((error) => error.property === "point");

    expect(pointError.constraints).toHaveProperty("isNotEmpty");
    expect(pointError.constraints.isNotEmpty).toEqual(
      "좌표는 비어있지 않아야 합니다.",
    );
  });

  it("문자열이 아닌 좌표로 요청 시 실패", async () => {
    (createDiaryDto.point as any) = 123.45;

    const errors = await validate(createDiaryDto);
    const pointError = errors.find((error) => error.property === "point");

    expect(pointError.constraints).toHaveProperty("isString");
    expect(pointError.constraints.isString).toEqual(
      "좌표는 문자열이어야 합니다.",
    );
  });

  it("적절하지 않은 양식의 좌표로 요청 시 실패", async () => {
    createDiaryDto.point = "123.45";

    const errors = await validate(createDiaryDto);
    const pointError = errors.find((error) => error.property === "point");

    expect(pointError.constraints).toHaveProperty("matches");
    expect(pointError.constraints.matches).toEqual(
      "적절하지 않은 좌표 양식입니다.",
    );
  });

  it("빈 날짜로 요청 시 실패", async () => {
    createDiaryDto.date = null;

    const errors = await validate(createDiaryDto);
    const dateError = errors.find((error) => error.property === "date");

    expect(dateError.constraints).toHaveProperty("isNotEmpty");
    expect(dateError.constraints.isNotEmpty).toEqual(
      "날짜는 비어있지 않아야 합니다.",
    );
  });

  it("배열 형태가 아닌 태그로 요청 시 실패", async () => {
    (createDiaryDto.tags as any) = "tag1, tag2";

    const errors = await validate(createDiaryDto);
    const tagsError = errors.find((error) => error.property === "tags");

    expect(tagsError.constraints).toHaveProperty("isArray");
    expect(tagsError.constraints.isArray).toEqual(
      "태그는 배열의 형태여야 합니다.",
    );
  });

  it("빈 모양 uuid로 요청 시 실패", async () => {
    createDiaryDto.shapeUuid = "";

    const errors = await validate(createDiaryDto);
    const uuidError = errors.find((error) => error.property === "shapeUuid");

    expect(uuidError.constraints.isNotEmpty).toEqual(
      "모양 uuid는 비어있지 않아야 합니다.",
    );
  });

  it("uuid 양식에 맞지 않는 모양 uuid로 요청 시 실패", async () => {
    createDiaryDto.shapeUuid = "invalid_uuid";

    const errors = await validate(createDiaryDto);
    const uuidError = errors.find((error) => error.property === "shapeUuid");

    expect(uuidError.constraints.isUuid).toEqual(
      "모양 uuid 값이 uuid 양식이어야 합니다.",
    );
  });
});

describe("ReadDiaryDto 단위 테스트", () => {
  let readDiaryDto: ReadDiaryDto;

  beforeEach(() => {
    readDiaryDto = new ReadDiaryDto();
  });

  it("정상 요청 시 성공", async () => {
    readDiaryDto.uuid = "3d991e7f-8423-4e44-9d8e-3f9f1ebaae4a";

    const errors = await validate(readDiaryDto);

    expect(errors).toHaveLength(0);
  });

  it("빈 uuid로 요청 시 실패", async () => {
    readDiaryDto.uuid = "";

    const errors = await validate(readDiaryDto);
    const uuidError = errors.find((error) => error.property === "uuid");

    expect(uuidError.constraints.isNotEmpty).toEqual(
      "일기 uuid는 비어있지 않아야 합니다.",
    );
  });

  it("uuid 양식에 맞지 않는 uuid로 요청 시 실패", async () => {
    readDiaryDto.uuid = "invalid_uuid";

    const errors = await validate(readDiaryDto);
    const uuidError = errors.find((error) => error.property === "uuid");

    expect(uuidError.constraints.isUuid).toEqual(
      "일기 uuid 값이 uuid 양식이어야 합니다.",
    );
  });
});

describe("UpdateDiaryDto 단위 테스트", () => {
  let updateDiaryDto: UpdateDiaryDto;

  beforeEach(() => {
    updateDiaryDto = new UpdateDiaryDto();
    updateDiaryDto.uuid = "3d991e7f-8423-4e44-9d8e-3f9f1ebaae4a";
    updateDiaryDto.title = "validTitle";
    updateDiaryDto.content = "validContent";
    updateDiaryDto.point = "1,2,3";
    (updateDiaryDto.date as any) = "2023-11-29";
    updateDiaryDto.tags = ["tag1", "tag2"];
    updateDiaryDto.shapeUuid = "3d991e7f-8423-4e44-9d8e-3f9f1ebaae4a";
  });

  it("정상 요청 시 성공", async () => {
    const errors = await validate(updateDiaryDto);

    expect(errors).toHaveLength(0);
  });

  it("빈 uuid로 요청 시 실패", async () => {
    updateDiaryDto.uuid = "";

    const errors = await validate(updateDiaryDto);
    const uuidError = errors.find((error) => error.property === "uuid");

    expect(uuidError.constraints.isNotEmpty).toEqual(
      "일기 uuid는 비어있지 않아야 합니다.",
    );
  });

  it("uuid 양식에 맞지 않는 uuid로 요청 시 실패", async () => {
    updateDiaryDto.uuid = "invalid_uuid";

    const errors = await validate(updateDiaryDto);
    const uuidError = errors.find((error) => error.property === "uuid");

    expect(uuidError.constraints.isUuid).toEqual(
      "일기 uuid 값이 uuid 양식이어야 합니다.",
    );
  });
});

describe("DeleteDiaryDto 단위 테스트", () => {
  let deleteDiaryDto: DeleteDiaryDto;

  beforeEach(() => {
    deleteDiaryDto = new DeleteDiaryDto();
    deleteDiaryDto.uuid = "3d991e7f-8423-4e44-9d8e-3f9f1ebaae4a";
  });

  it("정상 요청 시 성공", async () => {
    const errors = await validate(deleteDiaryDto);

    expect(errors).toHaveLength(0);
  });

  it("빈 uuid로 요청 시 실패", async () => {
    deleteDiaryDto.uuid = "";

    const errors = await validate(deleteDiaryDto);
    const uuidError = errors.find((error) => error.property === "uuid");

    expect(uuidError.constraints.isNotEmpty).toEqual(
      "일기 uuid는 비어있지 않아야 합니다.",
    );
  });

  it("uuid 양식에 맞지 않는 uuid로 요청 시 실패", async () => {
    deleteDiaryDto.uuid = "invalid_uuid";

    const errors = await validate(deleteDiaryDto);
    const uuidError = errors.find((error) => error.property === "uuid");

    expect(uuidError.constraints.isUuid).toEqual(
      "일기 uuid 값이 uuid 양식이어야 합니다.",
    );
  });
});
