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
      child: { standard: 1_190, premium: 2_190 },
      adult: { standard: 1_990, premium: 2_990 },
    },
  },
  {
    id: "sweatshirt",
    label: "Свитшот",
    prices: {
      child: { standard: 1_290, premium: 2_990 },
      adult: { standard: 1_990, premium: 3_690 },
    },
  },
  {
    id: "hoodie",
    label: "Худи",
    prices: {
      child: { standard: 3_290, premium: 5_200 },
      adult: { standard: 3_990, premium: 5_900 },
    },
  },
  {
    id: "zip-hoodie",
    label: "Зип-худи",
    prices: {
      child: { standard: 3_690, premium: 5_490 },
      adult: { standard: 4_690, premium: 6_590 },
    },
  },
] as const satisfies readonly ProductType[];

export const qualityLevels = [
  { id: "standard", label: "Стандарт" },
  { id: "premium", label: "Premium" },
] as const satisfies readonly QualityLevel[];

export const materialProfiles = [
  {
    productTypes: ["sweatshirt"],
    qualityLevel: "standard",
    description: "Футер 2-х нитка",
  },
  {
    productTypes: ["sweatshirt"],
    qualityLevel: "premium",
    description: "Футер пенье 3-х нитка, 330–370 г/м²",
  },
  {
    productTypes: ["hoodie", "zip-hoodie"],
    qualityLevel: "standard",
    description: "Футер 3-х нитка пенье, 330–370 г/м²",
  },
  {
    productTypes: ["hoodie", "zip-hoodie"],
    qualityLevel: "premium",
    description: "Футер 3-х нитка экстра-пенье, 450–500 г/м²",
  },
  {
    productTypes: ["t-shirt"],
    qualityLevel: "standard",
    description: "Кулирная гладь · 250–270 г/м² · 95% хлопок, 5% эластан",
  },
  {
    productTypes: ["t-shirt"],
    qualityLevel: "premium",
    description: "Интерлок · 300 г/м² · 100% хлопок",
  },
] as const satisfies readonly MaterialProfile[];

export const sizes = [
  { id: "98-104", label: "98–104", ageGroup: "child" },
  { id: "110-122", label: "110–122", ageGroup: "child" },
  { id: "134-140", label: "134–140", ageGroup: "child" },
  { id: "146-156", label: "146–156", ageGroup: "child" },
  { id: "S", label: "S", ageGroup: "adult" },
  { id: "M", label: "M", ageGroup: "adult" },
  { id: "L", label: "L", ageGroup: "adult" },
  { id: "XL", label: "XL", ageGroup: "adult" },
] as const satisfies readonly Size[];

export const ageGroups = [
  {
    id: "child",
    label: "Детское",
    sizes: ["98-104", "110-122", "134-140", "146-156"],
  },
  { id: "adult", label: "Взрослое", sizes: ["S", "M", "L", "XL"] },
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
  { id: "A6", label: "A6", dimensionsCm: "10 × 15 см", price: 1_000 },
  { id: "A5", label: "A5", dimensionsCm: "15 × 21 см", price: 2_000 },
  { id: "A4", label: "A4", dimensionsCm: "21 × 30 см", price: 4_000 },
] as const satisfies readonly EmbroiderySize[];

export const multiEmbroideryPricing = {
  perZone: 1_000,
} as const;

export const threadColorSurchargeOptions = [
  { id: "one", label: "1 цвет", surcharge: 0, isPreliminary: false, requiresIndividualCalculation: false },
  { id: "two-three", label: "2–3 цвета", surcharge: 250, isPreliminary: false, requiresIndividualCalculation: false },
  { id: "four-six", label: "4–6 цветов", surcharge: 500, isPreliminary: false, requiresIndividualCalculation: false },
  { id: "seven-plus", label: "7 и более", surcharge: 700, isPreliminary: true, requiresIndividualCalculation: true },
  { id: "unknown", label: "Не знаю", surcharge: 500, isPreliminary: true, requiresIndividualCalculation: false },
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
