import { IsNotEmpty } from "class-validator";

export class PurchaseDesignDto {
  @IsNotEmpty({ message: "구매 항목 종류는 비어있지 않아야 합니다." })
  domain: string;

  @IsNotEmpty({ message: "디자인은 비어있지 않아야 합니다." })
  design: string;
}
