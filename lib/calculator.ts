import {
  ageGroups,
  compatibilityRules,
  embroiderySizes,
  materialColors,
  packagingOptions,
  products,
  qualityLevels,
  sizes,
  threadColorSurchargeOptions,
} from "../config/calculator.ts";
import type {
  AgeGroupId,
  CalculatorSelectionState,
  CompleteCalculatorSelection,
  EmbroideryPlacementId,
  EmbroiderySizeId,
  PackagingOptionId,
  PreliminaryPrice,
  ProductTypeId,
  QualityLevelId,
  SelectionValidationResult,
  ThreadColorOptionId,
} from "@/types/calculator";

function findById<const T extends readonly { id: string }[]>(items: T, id: string): T[number] {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Unknown calculator option: ${id}`);
  return item;
}

export function calculateBaseProductPrice(
  productType: ProductTypeId,
  ageGroup: AgeGroupId,
  qualityLevel: QualityLevelId,
): number {
  return findById(products, productType).prices[ageGroup][qualityLevel];
}

/** Returns the fixed embroidery surcharge for a selected format. */
export function calculateEmbroideryPrice(embroiderySize: EmbroiderySizeId): number {
  return findById(embroiderySizes, embroiderySize).price;
}

/** Returns the surcharge used in the preliminary calculation. */
export function calculateThreadColorSurcharge(threadColors: ThreadColorOptionId): number {
  return findById(threadColorSurchargeOptions, threadColors).surcharge;
}

/** Returns zero for basic packaging or the configured gift surcharge. */
export function calculatePackagingPrice(packaging: PackagingOptionId): number {
  return findById(packagingOptions, packaging).price;
}

/** Calculates the complete price breakdown without mutating calculator state. */
export function calculateTotalPreliminaryPrice(
  selection: CompleteCalculatorSelection,
): PreliminaryPrice {
  const baseProduct = calculateBaseProductPrice(
    selection.productType,
    selection.ageGroup,
    selection.qualityLevel,
  );
  const embroidery = calculateEmbroideryPrice(selection.embroiderySize);
  const threadColorSurcharge = calculateThreadColorSurcharge(selection.threadColors);
  const packaging = calculatePackagingPrice(selection.packaging);
  const threadOption = findById(threadColorSurchargeOptions, selection.threadColors);

  return {
    baseProduct,
    embroidery,
    threadColorSurcharge,
    packaging,
    total: baseProduct + embroidery + threadColorSurcharge + packaging,
    isPreliminary: threadOption.isPreliminary,
    isFromPrice: threadOption.requiresIndividualCalculation,
  };
}

export function getAllowedPlacements(productType: ProductTypeId): EmbroideryPlacementId[] {
  return [...new Set(
    compatibilityRules
      .filter((rule) => rule.productType === productType)
      .map((rule) => rule.placement),
  )];
}

/** Resolves embroidery formats allowed by product, recipient group, and placement. */
export function getAllowedEmbroiderySizes(
  productType: ProductTypeId,
  ageGroup: AgeGroupId,
  placement: EmbroideryPlacementId,
): EmbroiderySizeId[] {
  const rule = compatibilityRules.find(
    (candidate) =>
      candidate.productType === productType &&
      candidate.ageGroup === ageGroup &&
      candidate.placement === placement,
  );
  return rule ? [...rule.embroiderySizes] : [];
}

/** Validates both completeness and all cross-field compatibility constraints. */
export function validateCalculatorSelection(
  selection: CalculatorSelectionState,
): SelectionValidationResult {
  const errors: string[] = [];
  const requiredFields = Object.entries(selection).filter(([, value]) => value === null);
  if (requiredFields.length > 0) errors.push("Не все обязательные параметры выбраны.");

  if (selection.ageGroup && selection.size) {
    const selectedSize = sizes.find((size) => size.id === selection.size);
    if (!selectedSize || selectedSize.ageGroup !== selection.ageGroup) {
      errors.push("Размер не соответствует выбранной возрастной группе.");
    }
  }

  if (selection.productType && selection.placement) {
    if (!getAllowedPlacements(selection.productType).includes(selection.placement)) {
      errors.push("Размещение недоступно для выбранного изделия.");
    }
  }

  if (selection.productType && selection.ageGroup && selection.placement && selection.embroiderySize) {
    const allowedSizes = getAllowedEmbroiderySizes(
      selection.productType,
      selection.ageGroup,
      selection.placement,
    );
    if (!allowedSizes.includes(selection.embroiderySize)) {
      errors.push("Размер вышивки недоступен для выбранной комбинации.");
    }
  }

  // These checks protect callers that receive untyped data at a runtime boundary.
  if (selection.productType && !products.some(({ id }) => id === selection.productType)) errors.push("Неизвестное изделие.");
  if (selection.ageGroup && !ageGroups.some(({ id }) => id === selection.ageGroup)) errors.push("Неизвестная возрастная группа.");
  if (selection.qualityLevel && !qualityLevels.some(({ id }) => id === selection.qualityLevel)) errors.push("Неизвестный уровень качества.");
  if (selection.color && !materialColors.some(({ id }) => id === selection.color)) errors.push("Неизвестный цвет.");

  return { isCompatible: errors.length === 0, errors };
}
