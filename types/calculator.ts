/** Identifiers for every product offered by the calculator. */
export type ProductTypeId =
  | "t-shirt"
  | "sweatshirt"
  | "hoodie"
  | "zip-hoodie";

export type AgeGroupId = "child" | "adult";
export type QualityLevelId = "standard" | "premium";

export type ChildSizeId =
  | "98-104"
  | "110-122"
  | "134-140"
  | "146-156";

export type AdultSizeId = "S" | "M" | "L" | "XL";
export type SizeId = ChildSizeId | AdultSizeId;

export type ColorId =
  | "white"
  | "gray-melange"
  | "black"
  | "red"
  | "blue"
  | "green"
  | "yellow";

export type EmbroideryPlacementId =
  | "chest"
  | "zip-left"
  | "zip-right"
  | "back"
  | "sleeve";

/** Selects the current single- or multi-embroidery calculator branch. */
export type EmbroideryMode = "single" | "multi";
export type MultiGarmentView = "front" | "back";
export type MultiZoneId =
  | "front-body-1"
  | "front-body-2"
  | "front-body-3"
  | "front-body-4"
  | "front-body-5"
  | "front-pocket-1"
  | "front-left-body-1"
  | "front-left-body-2"
  | "front-left-body-3"
  | "front-right-body-1"
  | "front-right-body-2"
  | "front-right-body-3"
  | "front-left-sleeve-1"
  | "front-left-sleeve-2"
  | "front-right-sleeve-1"
  | "front-right-sleeve-2"
  | "back-body-1"
  | "back-body-2"
  | "back-body-3"
  | "back-body-4"
  | "back-body-5";

export interface MultiEmbroiderySelectionState {
  mode: EmbroideryMode | null;
  zoneIds: readonly MultiZoneId[];
}

export interface CompleteMultiCalculatorSelection {
  productType: ProductTypeId;
  ageGroup: AgeGroupId;
  qualityLevel: QualityLevelId;
  size: SizeId;
  color: ColorId;
  packaging: PackagingOptionId;
  multiZoneIds: readonly MultiZoneId[];
}

export type EmbroiderySizeId = "A6" | "A5" | "A4";
export type ThreadColorOptionId = "one" | "two-three" | "four-six" | "seven-plus" | "unknown";
export type PackagingOptionId = "basic" | "gift";

export interface ProductType {
  id: ProductTypeId;
  label: string;
  prices: Record<AgeGroupId, Record<QualityLevelId, number>>;
}

export interface AgeGroup {
  id: AgeGroupId;
  label: string;
  sizes: readonly SizeId[];
}

export interface QualityLevel {
  id: QualityLevelId;
  label: string;
}

export interface MaterialProfile {
  productTypes: readonly ProductTypeId[];
  qualityLevel: QualityLevelId;
  description: string;
}

export interface Size {
  id: SizeId;
  label: string;
  ageGroup: AgeGroupId;
  approximateAge?: string;
}

export interface MaterialColor {
  id: ColorId;
  label: string;
  swatch: string;
}

export interface EmbroideryPlacement {
  id: EmbroideryPlacementId;
  label: string;
}

export interface EmbroiderySize {
  id: EmbroiderySizeId;
  label: string;
  dimensionsCm: string;
  price: number;
}

export interface ThreadColorSurchargeOption {
  id: ThreadColorOptionId;
  label: string;
  surcharge: number;
  isPreliminary: boolean;
  requiresIndividualCalculation: boolean;
}

export interface PackagingOption {
  id: PackagingOptionId;
  label: string;
  price: number;
  description: string;
}

/** One allowed product/recipient/placement combination and its embroidery sizes. */
export interface CompatibilityRule {
  productType: ProductTypeId;
  ageGroup: AgeGroupId;
  placement: EmbroideryPlacementId;
  embroiderySizes: readonly EmbroiderySizeId[];
}

/** State used while the customer moves through the calculator steps. */
export interface CalculatorSelectionState {
  productType: ProductTypeId | null;
  ageGroup: AgeGroupId | null;
  qualityLevel: QualityLevelId | null;
  size: SizeId | null;
  color: ColorId | null;
  placement: EmbroideryPlacementId | null;
  embroiderySize: EmbroiderySizeId | null;
  threadColors: ThreadColorOptionId | null;
  packaging: PackagingOptionId | null;
}

export interface CompleteCalculatorSelection {
  productType: ProductTypeId;
  ageGroup: AgeGroupId;
  qualityLevel: QualityLevelId;
  size: SizeId;
  color: ColorId;
  placement: EmbroideryPlacementId;
  embroiderySize: EmbroiderySizeId;
  threadColors: ThreadColorOptionId;
  packaging: PackagingOptionId;
}

export interface PreliminaryPrice {
  baseProduct: number;
  embroidery: number;
  threadColorSurcharge: number;
  packaging: number;
  total: number;
  isPreliminary: boolean;
  isFromPrice: boolean;
}

export interface SelectionValidationResult {
  isCompatible: boolean;
  errors: readonly string[];
}
