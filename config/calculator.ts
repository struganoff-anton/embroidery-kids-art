import type {
  AgeGroup,
  CompatibilityRule,
  EmbroideryPlacement,
  EmbroiderySize,
  MaterialProfile,
  MaterialColor,
  PackagingOption,
  ProductType,
  QualityLevel,
  Size,
  ThreadColorSurchargeOption,
} from "@/types/calculator";

/** All user-facing calculator data, prices, and compatibility rules live here. */
export const products = [
  {
    id: "t-shirt",
    label: "Футболка",
    prices: {
      child: { standard: 1_990, premium: 2_390 },
      adult: { standard: 2_490, premium: 2_990 },
    },
  },
  {
    id: "sweatshirt",
    label: "Свитшот",
    prices: {
      child: { standard: 2_990, premium: 3_690 },
      adult: { standard: 3_690, premium: 4_490 },
    },
  },
  {
    id: "hoodie",
    label: "Худи",
    prices: {
      child: { standard: 4_990, premium: 5_590 },
      adult: { standard: 6_650, premium: 7_450 },
    },
  },
  {
    id: "zip-hoodie",
    label: "Зип-худи",
    prices: {
      child: { standard: 5_690, premium: 6_290 },
      adult: { standard: 7_490, premium: 8_290 },
    },
  },
] as const satisfies readonly ProductType[];

export const qualityLevels = [
  { id: "standard", label: "Стандарт" },
  { id: "premium", label: "Premium" },
] as const satisfies readonly QualityLevel[];

export const materialProfiles = [
  {
    productTypes: ["sweatshirt", "hoodie", "zip-hoodie"],
    qualityLevel: "standard",
    fabric: "Футер пенье",
    density: "420–470 г/м²",
    composition: "100% хлопок",
  },
  {
    productTypes: ["sweatshirt", "hoodie", "zip-hoodie"],
    qualityLevel: "premium",
    fabric: "Футер экстра-пенье",
    density: "500 г/м²",
    composition: "100% хлопок",
  },
  {
    productTypes: ["t-shirt"],
    qualityLevel: "standard",
    fabric: "Кулирная гладь",
    density: "250–270 г/м²",
    composition: "95% хлопок, 5% эластан",
  },
  {
    productTypes: ["t-shirt"],
    qualityLevel: "premium",
    fabric: "Интерлок",
    density: "300 г/м²",
    composition: "100% хлопок",
  },
] as const satisfies readonly MaterialProfile[];

export const sizes = [
  { id: "98-104", label: "98–104", ageGroup: "child", approximateAge: "2–3 года" },
  { id: "104-110", label: "104–110", ageGroup: "child" },
  { id: "110-122", label: "110–122", ageGroup: "child" },
  { id: "122-134", label: "122–134", ageGroup: "child" },
  { id: "134-140", label: "134–140", ageGroup: "child" },
  { id: "140-146", label: "140–146", ageGroup: "child" },
  { id: "146-156", label: "146–156", ageGroup: "child" },
  { id: "XS", label: "XS", ageGroup: "adult" },
  { id: "S", label: "S", ageGroup: "adult" },
  { id: "M", label: "M", ageGroup: "adult" },
  { id: "L", label: "L", ageGroup: "adult" },
  { id: "XL", label: "XL", ageGroup: "adult" },
  { id: "XXL", label: "XXL", ageGroup: "adult" },
] as const satisfies readonly Size[];

export const ageGroups = [
  {
    id: "child",
    label: "Детское",
    sizes: ["98-104", "104-110", "110-122", "122-134", "134-140", "140-146", "146-156"],
  },
  { id: "adult", label: "Взрослое", sizes: ["XS", "S", "M", "L", "XL", "XXL"] },
] as const satisfies readonly AgeGroup[];

export const materialColors = [
  { id: "white", label: "Белый", swatch: "#f7f7f4" },
  { id: "gray-melange", label: "Серый меланж", swatch: "#a9aaa7" },
  { id: "black", label: "Чёрный", swatch: "#202020" },
  { id: "red", label: "Красный", swatch: "#b8473d" },
  { id: "blue", label: "Синий", swatch: "#315c83" },
  { id: "green", label: "Зелёный", swatch: "#55745a" },
  { id: "yellow", label: "Жёлтый", swatch: "#e6c44b" },
] as const satisfies readonly MaterialColor[];

/** Temporary destinations to replace when the brand accounts are available. */
export const messengerUrls = {
  telegram: "https://t.me/example",
  max: "https://max.ru/u/example",
} as const;

export const embroideryPlacements = [
  { id: "chest", label: "Грудь" },
  { id: "zip-left", label: "Слева от молнии" },
  { id: "zip-right", label: "Справа от молнии" },
  { id: "back", label: "Спина" },
  { id: "sleeve", label: "Рукав" },
] as const satisfies readonly EmbroideryPlacement[];

export const embroiderySizes = [
  { id: "A6", label: "A6", dimensionsCm: "10 × 15 см", price: 2_000 },
  { id: "A5", label: "A5", dimensionsCm: "15 × 21 см", price: 4_000 },
  { id: "A4", label: "A4", dimensionsCm: "21 × 30 см", price: 6_000 },
] as const satisfies readonly EmbroiderySize[];

export const multiEmbroideryPricing = {
  first: 2_000,
  additional: 1_700,
} as const;

export const threadColorSurchargeOptions = [
  { id: "one", label: "1 цвет", surcharge: 0, isPreliminary: false, requiresIndividualCalculation: false },
  { id: "two-three", label: "2–3 цвета", surcharge: 390, isPreliminary: false, requiresIndividualCalculation: false },
  { id: "four-six", label: "4–6 цветов", surcharge: 1_000, isPreliminary: false, requiresIndividualCalculation: false },
  { id: "seven-plus", label: "7 и более", surcharge: 1_500, isPreliminary: true, requiresIndividualCalculation: true },
  { id: "unknown", label: "Не знаю", surcharge: 1_000, isPreliminary: true, requiresIndividualCalculation: false },
] as const satisfies readonly ThreadColorSurchargeOption[];

export const packagingOptions = [
  { id: "basic", label: "Базовая упаковка", price: 0, description: "Zip-пакет, входит в стоимость" },
  { id: "gift", label: "Подарочная упаковка", price: 790, description: "Крафтовая коробка с лентой" },
] as const satisfies readonly PackagingOption[];

const standardPlacements = ["chest", "back", "sleeve"] as const;
const zipPlacements = ["zip-left", "zip-right", "back", "sleeve"] as const;

export const compatibilityRules = (["child", "adult"] as const).flatMap((ageGroup) =>
  products.flatMap(({ id: productType }) => {
    const placements = productType === "zip-hoodie" ? zipPlacements : standardPlacements;

    return placements.map((placement) => {
      const embroiderySizes =
        placement === "sleeve"
          ? (["A6"] as const)
          : ageGroup === "adult" && placement !== "zip-left" && placement !== "zip-right"
            ? (["A6", "A5", "A4"] as const)
            : (["A6", "A5"] as const);

      return { productType, ageGroup, placement, embroiderySizes };
    });
  }),
) satisfies readonly CompatibilityRule[];
