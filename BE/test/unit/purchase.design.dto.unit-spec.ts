import { validate } from "class-validator";
import { PurchaseDesignDto } from "../../src/purchase/dto/purchase.design.dto";

describe("PurchaaseDesignDto 단위 테스트", () => {
  let purchaseDesignDto;

  beforeEach(() => {
    purchaseDesignDto = new PurchaseDesignDto();
  });

  it("모든 값이 유효한 요청 시 성공", async () => {
    purchaseDesignDto.domain = "GROUND";
    purchaseDesignDto.design = "GROUND_GREEN";

    const errors = await validate(purchaseDesignDto);

    expect(errors).toHaveLength(0);
  });

  it("빈 구매 항목 종류로 요청 시 실패", async () => {
    purchaseDesignDto.domain = "";
    purchaseDesignDto.design = "GROUND_GREEN";

    const errors = await validate(purchaseDesignDto);
    expect(errors[0].constraints.isNotEmpty).toBe(
      "구매 항목 종류는 비어있지 않아야 합니다.",
    );
  });

  it("domainEnum 값이 아닌 구매 항목 종류로 요청 시 실패", async () => {
    purchaseDesignDto.domain = "실패";
    purchaseDesignDto.design = "GROUND_GREEN";

    const errors = await validate(purchaseDesignDto);
    expect(errors[0].constraints.isIn).toBe(
      "적절하지 않은 구매 항목 종류 양식입니다.",
    );
  });

  it("빈 디자인으로 요청 시 실패", async () => {
    purchaseDesignDto.domain = "GROUND";
    purchaseDesignDto.design = "";

    const errors = await validate(purchaseDesignDto);

    expect(errors[0].constraints.isNotEmpty).toBe(
      "디자인은 비어있지 않아야 합니다.",
    );
  });

  it("designEnum 값이 아닌 디자인으로 요청 시 실패", async () => {
    purchaseDesignDto.domain = "GROUND";
    purchaseDesignDto.design = "실패";

    const errors = await validate(purchaseDesignDto);

    expect(errors[0].constraints.isIn).toBe("적절하지 않은 디자인 양식입니다.");
  });
});
