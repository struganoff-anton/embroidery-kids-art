import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  calculateBaseProductPrice,
  calculateEmbroideryPrice,
  calculateMultiEmbroideryPrice,
  calculatePackagingPrice,
  calculateThreadColorSurcharge,
  calculateTotalPreliminaryPrice,
  getAllowedEmbroiderySizes,
  getAllowedPlacements,
  validateCalculatorSelection,
} from "../lib/calculator.ts";
import { multiPlacementConfigs } from "../config/multi-embroidery.ts";
import type {
  CalculatorSelectionState,
  CompleteCalculatorSelection,
  EmbroideryPlacementId,
  EmbroiderySizeId,
  ProductTypeId,
  QualityLevelId,
  ThreadColorOptionId,
} from "../types/calculator.ts";

const validAdultSelection: CompleteCalculatorSelection = {
  productType: "hoodie",
  ageGroup: "adult",
  qualityLevel: "premium",
  size: "L",
  color: "gray-melange",
  placement: "chest",
  embroiderySize: "A5",
  threadColors: "four-six",
  packaging: "gift",
};

describe("base product prices", () => {
  const expectedPrices = {
    adult: {
      "t-shirt": { standard: 2_490, premium: 2_990 },
      sweatshirt: { standard: 3_690, premium: 4_490 },
      hoodie: { standard: 6_650, premium: 7_450 },
      "zip-hoodie": { standard: 7_490, premium: 8_290 },
    },
    child: {
      "t-shirt": { standard: 1_990, premium: 2_390 },
      sweatshirt: { standard: 2_990, premium: 3_690 },
      hoodie: { standard: 4_990, premium: 5_590 },
      "zip-hoodie": { standard: 5_690, premium: 6_290 },
    },
  } as const;

  for (const ageGroup of ["adult", "child"] as const) {
    for (const productType of Object.keys(expectedPrices[ageGroup]) as ProductTypeId[]) {
      for (const qualityLevel of ["standard", "premium"] as QualityLevelId[]) {
        test(`${ageGroup} ${productType} ${qualityLevel}`, () => {
          assert.equal(
            calculateBaseProductPrice(productType, ageGroup, qualityLevel),
            expectedPrices[ageGroup][productType][qualityLevel],
          );
        });
      }
    }
  }
});

describe("calculator surcharges", () => {
  for (const [size, price] of Object.entries({ A6: 2_000, A5: 4_000, A4: 6_000 })) {
    test(`embroidery ${size}`, () => {
      assert.equal(calculateEmbroideryPrice(size as EmbroiderySizeId), price);
    });
  }

  const threadSurcharges: Record<ThreadColorOptionId, number> = {
    one: 0,
    "two-three": 390,
    "four-six": 1_000,
    "seven-plus": 1_500,
    unknown: 1_000,
  };
  for (const [option, surcharge] of Object.entries(threadSurcharges)) {
    test(`thread colors ${option}`, () => {
      assert.equal(calculateThreadColorSurcharge(option as ThreadColorOptionId), surcharge);
    });
  }

  test("basic packaging", () => assert.equal(calculatePackagingPrice("basic"), 0));
  test("gift packaging", () => assert.equal(calculatePackagingPrice("gift"), 790));
});

describe("multi-embroidery pricing", () => {
  test("one zone", () => assert.equal(calculateMultiEmbroideryPrice(1), 2_000));
  test("two zones", () => assert.equal(calculateMultiEmbroideryPrice(2), 3_700));
  test("three zones", () => assert.equal(calculateMultiEmbroideryPrice(3), 5_400));
  test("five zones", () => assert.equal(calculateMultiEmbroideryPrice(5), 8_800));
});

describe("sweatshirt multi-placement configuration", () => {
  const zones = multiPlacementConfigs.sweatshirt?.zones ?? [];

  test("has nine front zones", () => assert.equal(zones.filter(({ view }) => view === "front").length, 9));
  test("has five back zones", () => assert.equal(zones.filter(({ view }) => view === "back").length, 5));
  test("has no pocket zone", () => assert.equal(zones.some(({ id }) => id === "front-pocket-1"), false));
});

describe("zip hoodie multi-placement configuration", () => {
  const zones = multiPlacementConfigs["zip-hoodie"]?.zones ?? [];

  test("has ten front zones", () => assert.equal(zones.filter(({ view }) => view === "front").length, 10));
  test("has five back zones", () => assert.equal(zones.filter(({ view }) => view === "back").length, 5));
  test("has no center-front zone", () => assert.equal(zones.some(({ id }) => id.startsWith("front-body")), false));
});

describe("PROJECT_SPEC.md total examples", () => {
  const examples: readonly [string, CompleteCalculatorSelection, number][] = [
    [
      "adult premium sweatshirt",
      { ...validAdultSelection, productType: "sweatshirt", embroiderySize: "A5" },
      10_280,
    ],
    [
      "child standard T-shirt",
      {
        ...validAdultSelection,
        productType: "t-shirt",
        ageGroup: "child",
        qualityLevel: "standard",
        size: "98-104",
        embroiderySize: "A6",
        threadColors: "two-three",
        packaging: "basic",
      },
      4_380,
    ],
    [
      "adult premium hoodie",
      {
        ...validAdultSelection,
        embroiderySize: "A4",
        threadColors: "one",
      },
      14_240,
    ],
  ];

  for (const [name, selection, total] of examples) {
    test(name, () => assert.equal(calculateTotalPreliminaryPrice(selection).total, total));
  }
});

describe("compatibility rules", () => {
  const nonZipProducts = ["t-shirt", "sweatshirt", "hoodie"] as const;
  const allProducts = [...nonZipProducts, "zip-hoodie"] as const;

  for (const product of nonZipProducts) {
    test(`adult ${product} chest allows A6, A5, A4`, () => {
      assert.deepEqual(getAllowedEmbroiderySizes(product, "adult", "chest"), ["A6", "A5", "A4"]);
    });
  }

  for (const placement of ["zip-left", "zip-right"] as EmbroideryPlacementId[]) {
    test(`adult zip hoodie ${placement} allows A6, A5`, () => {
      assert.deepEqual(getAllowedEmbroiderySizes("zip-hoodie", "adult", placement), ["A6", "A5"]);
    });
  }

  for (const product of allProducts) {
    test(`adult ${product} back allows A6, A5, A4`, () => {
      assert.deepEqual(getAllowedEmbroiderySizes(product, "adult", "back"), ["A6", "A5", "A4"]);
    });
    test(`adult ${product} sleeve allows only A6`, () => {
      assert.deepEqual(getAllowedEmbroiderySizes(product, "adult", "sleeve"), ["A6"]);
    });
    test(`child ${product} back allows A6, A5`, () => {
      assert.deepEqual(getAllowedEmbroiderySizes(product, "child", "back"), ["A6", "A5"]);
    });
    test(`child ${product} sleeve allows only A6`, () => {
      assert.deepEqual(getAllowedEmbroiderySizes(product, "child", "sleeve"), ["A6"]);
    });
  }

  for (const product of nonZipProducts) {
    test(`child ${product} chest allows A6, A5`, () => {
      assert.deepEqual(getAllowedEmbroiderySizes(product, "child", "chest"), ["A6", "A5"]);
    });
  }

  test("zip hoodie replaces generic chest with left and right placements", () => {
    const placements = getAllowedPlacements("zip-hoodie");
    assert.deepEqual(placements, ["zip-left", "zip-right", "back", "sleeve"]);
    assert.ok(!placements.includes("chest"));
    assert.deepEqual(getAllowedEmbroiderySizes("zip-hoodie", "adult", "chest"), []);
  });
});

describe("selection validation and estimate flags", () => {
  test("accepts a complete valid selection", () => {
    assert.deepEqual(validateCalculatorSelection(validAdultSelection), {
      isCompatible: true,
      errors: [],
    });
  });

  test("rejects an incomplete selection", () => {
    const incomplete: CalculatorSelectionState = { ...validAdultSelection, color: null };
    const result = validateCalculatorSelection(incomplete);
    assert.equal(result.isCompatible, false);
    assert.ok(result.errors.includes("Не все обязательные параметры выбраны."));
  });

  test("rejects an incompatible embroidery size", () => {
    const result = validateCalculatorSelection({
      ...validAdultSelection,
      placement: "sleeve",
      embroiderySize: "A5",
    });
    assert.equal(result.isCompatible, false);
    assert.ok(result.errors.includes("Размер вышивки недоступен для выбранной комбинации."));
  });

  test("rejects an invalid placement for the product", () => {
    const result = validateCalculatorSelection({
      ...validAdultSelection,
      productType: "zip-hoodie",
      placement: "chest",
    });
    assert.equal(result.isCompatible, false);
    assert.ok(result.errors.includes("Размещение недоступно для выбранного изделия."));
  });

  test("seven or more colors requires individual calculation and a from price", () => {
    const selection = { ...validAdultSelection, threadColors: "seven-plus" } as const;
    assert.equal(validateCalculatorSelection(selection).isCompatible, true);
    const price = calculateTotalPreliminaryPrice(selection);
    assert.equal(price.threadColorSurcharge, 1_500);
    assert.equal(price.isPreliminary, true);
    assert.equal(price.isFromPrice, true);
  });

  test("unknown colors produces a preliminary estimate", () => {
    const selection = { ...validAdultSelection, threadColors: "unknown" } as const;
    assert.equal(validateCalculatorSelection(selection).isCompatible, true);
    const price = calculateTotalPreliminaryPrice(selection);
    assert.equal(price.threadColorSurcharge, 1_000);
    assert.equal(price.isPreliminary, true);
    assert.equal(price.isFromPrice, false);
  });
});
