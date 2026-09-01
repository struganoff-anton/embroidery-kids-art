import { ageGroups, embroideryPlacements, embroiderySizes, materialColors, packagingOptions, products, qualityLevels, sizes, threadColorSurchargeOptions } from "@/config/calculator";
import { calculateBaseProductPrice, calculateEmbroideryPrice, calculateMultiEmbroideryPrice, calculatePackagingPrice, calculateThreadColorSurcharge } from "@/lib/calculator";
import type { CalculatorSelectionState, MultiEmbroiderySelectionState } from "@/types/calculator";

export const formatPrice = (price: number) => `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
export const labelOf = <T extends readonly { id: string; label: string }[]>(items: T, id: string | null) => id ? items.find((item) => item.id === id)?.label : undefined;

export function getCurrentPrice(selection: CalculatorSelectionState, multiSelection?: MultiEmbroiderySelectionState): number {
  let total = 0;
  if (selection.productType && selection.ageGroup && selection.qualityLevel) total += calculateBaseProductPrice(selection.productType, selection.ageGroup, selection.qualityLevel);
  if (multiSelection?.mode === "multi") total += calculateMultiEmbroideryPrice(multiSelection.zoneIds.length);
  else {
    if (selection.embroiderySize) total += calculateEmbroideryPrice(selection.embroiderySize);
    if (selection.threadColors) total += calculateThreadColorSurcharge(selection.threadColors);
  }
  if (selection.packaging) total += calculatePackagingPrice(selection.packaging);
  return total;
}

export function OrderSummary({ selection, multiSelection, compact = false }: { selection: CalculatorSelectionState; multiSelection?: MultiEmbroiderySelectionState; compact?: boolean }) {
  const standardRows = [
    ["Изделие", labelOf(products, selection.productType)], ["Для кого", labelOf(ageGroups, selection.ageGroup)],
    ["Качество", labelOf(qualityLevels, selection.qualityLevel)], ["Размер", labelOf(sizes, selection.size)],
    ["Цвет", labelOf(materialColors, selection.color)], ["Размещение", labelOf(embroideryPlacements, selection.placement)],
    ["Вышивка", labelOf(embroiderySizes, selection.embroiderySize)], ["Цвета нитей", labelOf(threadColorSurchargeOptions, selection.threadColors)],
    ["Упаковка", labelOf(packagingOptions, selection.packaging)],
  ];
  const multiRows = [
    ["Изделие", labelOf(products, selection.productType)], ["Для кого", labelOf(ageGroups, selection.ageGroup)],
    ["Качество", labelOf(qualityLevels, selection.qualityLevel)], ["Размер", labelOf(sizes, selection.size)],
    ["Цвет", labelOf(materialColors, selection.color)], ["Размещение", "Несколько рисунков"],
    ["Количество рисунков", multiSelection?.zoneIds.length ? String(multiSelection.zoneIds.length) : undefined],
    ["Размер каждой вышивки", multiSelection?.zoneIds.length ? "до A6" : undefined],
    ["Упаковка", labelOf(packagingOptions, selection.packaging)],
  ];
  const rows = (multiSelection?.mode === "multi" ? multiRows : standardRows).filter((row): row is [string, string] => Boolean(row[1]));
  const total = getCurrentPrice(selection, multiSelection);
  if (compact) return <div><span className="block text-xs text-muted">Предварительно</span><strong className="text-lg font-semibold text-foreground">{total ? formatPrice(total) : "—"}</strong></div>;
  return (
    <aside className="rounded-container border border-line bg-surface p-6 shadow-surface" aria-label="Текущий заказ">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Ваш выбор</p>
      {rows.length ? <dl className="mt-5 space-y-3">{rows.map(([label, value]) => <div key={label} className="flex justify-between gap-4 text-sm"><dt className="text-muted">{label}</dt><dd className="text-right font-medium text-foreground">{value}</dd></div>)}</dl> : <p className="mt-5 text-sm leading-6 text-muted">Выбранные параметры появятся здесь.</p>}
      <div className="mt-6 border-t border-line pt-5"><span className="text-sm text-muted">Предварительная стоимость</span><strong className="mt-1 block text-2xl font-semibold text-foreground">{total ? formatPrice(total) : "—"}</strong></div>
    </aside>
  );
}
