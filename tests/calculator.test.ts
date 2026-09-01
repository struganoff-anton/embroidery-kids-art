import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  calculateBaseProductPrice,
  calculateEmbroideryPrice,
  calculateMultiEmbroideryPrice,
  calculateMultiTotalPreliminaryPrice,
  calculatePackagingPrice,
  calculateThreadColorSurcharge,
  calculateTotalPreliminaryPrice,
  getAllowedEmbroiderySizes,
  getAllowedPlacements,
  validateCalculatorSelection,
} from "../lib/calculator.ts";
import { ageGroups, materialProfiles, sizes } from "../config/calculator.ts";
import { multiPlacementConfigs } from "../config/multi-embroidery.ts";
import type {
  CalculatorSelectionState,
  CompleteCalculatorSelection,
  CompleteMultiCalculatorSelection,
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
      "t-shirt": { standard: 1_990, premium: 2_990 },
      sweatshirt: { standard: 1_990, premium: 3_690 },
      hoodie: { standard: 3_990, premium: 5_900 },
      "zip-hoodie": { standard: 4_690, premium: 6_590 },
    },
    child: {
      "t-shirt": { standard: 1_190, premium: 2_190 },
      sweatshirt: { standard: 1_290, premium: 2_990 },
      hoodie: { standard: 3_290, premium: 5_200 },
      "zip-hoodie": { standard: 3_690, premium: 5_490 },
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

describe("size options", () => {
  test("kids have exactly the agreed sizes", () => {
    assert.deepEqual(sizes.filter(({ ageGroup }) => ageGroup === "child").map(({ label }) => label), ["98–104", "110–122", "134–140", "146–156"]);
    assert.deepEqual(ageGroups.find(({ id }) => id === "child")?.sizes, ["98-104", "110-122", "134-140", "146-156"]);
  });

  test("adults have exactly the agreed sizes", () => {
    assert.deepEqual(sizes.filter(({ ageGroup }) => ageGroup === "adult").map(({ label }) => label), ["S", "M", "L", "XL"]);
    assert.deepEqual(ageGroups.find(({ id }) => id === "adult")?.sizes, ["S", "M", "L", "XL"]);
  });
});

describe("material descriptions", () => {
  const description = (productType: ProductTypeId, qualityLevel: QualityLevelId) => materialProfiles.find((profile) => profile.qualityLevel === qualityLevel && (profile.productTypes as readonly ProductTypeId[]).includes(productType))?.description;

  test("sweatshirt descriptions", () => {
    assert.equal(description("sweatshirt", "standard"), "Футер 2-х нитка");
    assert.equal(description("sweatshirt", "premium"), "Футер пенье 3-х нитка, 330–370 г/м²");
  });

  test("hoodie and zip hoodie descriptions", () => {
    for (const product of ["hoodie", "zip-hoodie"] as const) {
      assert.equal(description(product, "standard"), "Футер 3-х нитка пенье, 330–370 г/м²");
      assert.equal(description(product, "premium"), "Футер 3-х нитка экстра-пенье, 450–500 г/м²");
    }
  });
});

describe("calculator surcharges", () => {
  for (const [size, price] of Object.entries({ A6: 1_000, A5: 2_000, A4: 4_000 })) {
    test(`embroidery ${size}`, () => {
      assert.equal(calculateEmbroideryPrice(size as EmbroiderySizeId), price);
    });
  }

  const threadSurcharges: Record<ThreadColorOptionId, number> = {
    one: 0,
    "two-three": 250,
    "four-six": 500,
    "seven-plus": 700,
    unknown: 500,
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
  for (const [zones, price] of [[2, 2_000], [3, 3_000], [5, 5_000], [10, 10_000], [15, 15_000]] as const) {
    test(`${zones} zones`, () => assert.equal(calculateMultiEmbroideryPrice(zones), price));
  }
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

describe("complete order totals", () => {
  const examples: readonly [string, CompleteCalculatorSelection, number][] = [
    [
      "adult premium sweatshirt",
      { ...validAdultSelection, productType: "sweatshirt", embroiderySize: "A5" },
      6_980,
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
      2_440,
    ],
    [
      "adult premium hoodie",
      {
        ...validAdultSelection,
        embroiderySize: "A4",
        threadColors: "one",
      },
      10_690,
    ],
  ];

  for (const [name, selection, total] of examples) {
    test(name, () => assert.equal(calculateTotalPreliminaryPrice(selection).total, total));
  }

  test("multi embroidery adds one thousand rubles per selected zone", () => {
    const selection: CompleteMultiCalculatorSelection = {
      productType: "zip-hoodie",
      ageGroup: "adult",
      qualityLevel: "standard",
      size: "M",
      color: "black",
      packaging: "gift",
      multiZoneIds: ["front-left-body-1", "front-right-body-1", "back-body-3"],
    };
    assert.deepEqual(calculateMultiTotalPreliminaryPrice(selection), {
      baseProduct: 4_690,
      embroidery: 3_000,
      threadColorSurcharge: 0,
      packaging: 790,
      total: 8_480,
      isPreliminary: true,
      isFromPrice: false,
    });
  });
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
    assert.equal(price.threadColorSurcharge, 700);
    assert.equal(price.isPreliminary, true);
    assert.equal(price.isFromPrice, true);
  });

  test("unknown colors produces a preliminary estimate", () => {
    const selection = { ...validAdultSelection, threadColors: "unknown" } as const;
    assert.equal(validateCalculatorSelection(selection).isCompatible, true);
    const price = calculateTotalPreliminaryPrice(selection);
    assert.equal(price.threadColorSurcharge, 500);
    assert.equal(price.isPreliminary, true);
    assert.equal(price.isFromPrice, false);
  });
});
