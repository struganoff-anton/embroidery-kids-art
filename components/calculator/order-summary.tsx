import { ageGroups, embroideryPlacements, embroiderySizes, materialColors, packagingOptions, products, qualityLevels, sizes, threadColorSurchargeOptions } from "@/config/calculator";
import { calculateBaseProductPrice, calculateEmbroideryPrice, calculatePackagingPrice, calculateThreadColorSurcharge } from "@/lib/calculator";
import type { CalculatorSelectionState } from "@/types/calculator";

export const formatPrice = (price: number) => `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
export const labelOf = <T extends readonly { id: string; label: string }[]>(items: T, id: string | null) => id ? items.find((item) => item.id === id)?.label : undefined;

export function getCurrentPrice(selection: CalculatorSelectionState): number {
  let total = 0;
  if (selection.productType && selection.ageGroup && selection.qualityLevel) total += calculateBaseProductPrice(selection.productType, selection.ageGroup, selection.qualityLevel);
  if (selection.embroiderySize) total += calculateEmbroideryPrice(selection.embroiderySize);
  if (selection.threadColors) total += calculateThreadColorSurcharge(selection.threadColors);
  if (selection.packaging) total += calculatePackagingPrice(selection.packaging);
  return total;
}

export function OrderSummary({ selection, compact = false }: { selection: CalculatorSelectionState; compact?: boolean }) {
  const rows = [
    ["Изделие", labelOf(products, selection.productType)], ["Для кого", labelOf(ageGroups, selection.ageGroup)],
    ["Качество", labelOf(qualityLevels, selection.qualityLevel)], ["Размер", labelOf(sizes, selection.size)],
    ["Цвет", labelOf(materialColors, selection.color)], ["Размещение", labelOf(embroideryPlacements, selection.placement)],
    ["Вышивка", labelOf(embroiderySizes, selection.embroiderySize)], ["Цвета нитей", labelOf(threadColorSurchargeOptions, selection.threadColors)],
    ["Упаковка", labelOf(packagingOptions, selection.packaging)],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  const total = getCurrentPrice(selection);
  if (compact) return <div><span className="block text-xs text-stone-500">Предварительно</span><strong className="text-lg">{total ? formatPrice(total) : "—"}</strong></div>;
  return (
    <aside className="rounded-3xl border border-stone-200 bg-white p-6" aria-label="Текущий заказ">
      <p className="text-sm font-semibold uppercase tracking-wider text-stone-500">Ваш выбор</p>
      {rows.length ? <dl className="mt-5 space-y-3">{rows.map(([label, value]) => <div key={label} className="flex justify-between gap-4 text-sm"><dt className="text-stone-500">{label}</dt><dd className="text-right font-medium">{value}</dd></div>)}</dl> : <p className="mt-5 text-sm leading-6 text-stone-500">Выбранные параметры появятся здесь.</p>}
      <div className="mt-6 border-t border-stone-200 pt-5"><span className="text-sm text-stone-500">Предварительная стоимость</span><strong className="mt-1 block text-2xl">{total ? formatPrice(total) : "—"}</strong></div>
    </aside>
  );
}
