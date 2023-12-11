import { IsIn, IsNotEmpty } from "class-validator";
import { designEnum, domainEnum } from "src/utils/enum";

export class PurchaseDesignDto {
  @IsNotEmpty({ message: "구매 항목 종류는 비어있지 않아야 합니다." })
  @IsIn(Object.keys(domainEnum), {
    message: "적절하지 않은 구매 항목 종류 양식입니다.",
  })
  domain: string;

  @IsNotEmpty({ message: "디자인은 비어있지 않아야 합니다." })
  @IsIn(Object.keys(designEnum), {
    message: "적절하지 않은 디자인 양식입니다.",
  })
  design: string;
}

export class PurchaseListDto {
  [domain: string]: { design: string[] };
}
