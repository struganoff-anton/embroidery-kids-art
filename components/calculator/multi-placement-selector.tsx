import Image from "next/image";
import type { MultiPlacementProductConfig } from "@/config/multi-embroidery";
import type { MultiGarmentView, MultiZoneId } from "@/types/calculator";
import { formatPrice } from "./order-summary";

interface MultiPlacementSelectorProps {
  config: MultiPlacementProductConfig;
  productLabel: string;
  view: MultiGarmentView;
  selectedZoneIds: readonly MultiZoneId[];
  embroideryPrice: number;
  onViewChange: (view: MultiGarmentView) => void;
  onToggleZone: (zoneId: MultiZoneId) => void;
}

export function MultiPlacementSelector({ config, productLabel, view, selectedZoneIds, embroideryPrice, onViewChange, onToggleZone }: MultiPlacementSelectorProps) {
  const visibleZones = config.zones.filter((zone) => zone.view === view);

  return <div>
    <div className="grid grid-cols-2 gap-2 rounded-button bg-background p-1" role="group" aria-label="Вид изделия">
      {(["front", "back"] as const).map((value) => <button key={value} type="button" aria-pressed={view === value} onClick={() => onViewChange(value)} className={`min-h-11 rounded-button px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-accent-secondary ${view === value ? "bg-surface text-foreground shadow-surface" : "text-muted hover:text-foreground"}`}>{value === "front" ? "Спереди" : "Сзади"}</button>)}
    </div>

    <div className="mx-auto mt-4 w-full max-w-md overflow-hidden rounded-card border border-line bg-background">
      <div className="relative w-full" style={{ aspectRatio: config.imageAspectRatios?.[view] ?? "1086 / 1448" }}>
        <Image src={config.images[view]} alt={`${productLabel}, вид ${view === "front" ? "спереди" : "сзади"}`} fill sizes="(max-width: 640px) calc(100vw - 3rem), 448px" className="object-contain" />
        {visibleZones.map((zone) => {
          const selectionIndex = selectedZoneIds.indexOf(zone.id);
          const selected = selectionIndex >= 0;
          return <button key={zone.id} type="button" aria-label={`${zone.label}${selected ? `, выбрано под номером ${selectionIndex + 1}` : ""}`} aria-pressed={selected} onClick={() => onToggleZone(zone.id)} className={`absolute flex items-center justify-center rounded-[5px] border-2 border-dashed text-xs font-bold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary ${selected ? "border-accent bg-accent/20 text-foreground" : "border-accent/70 bg-white/10 text-transparent hover:bg-accent/10"}`} style={{ left: `${zone.left}%`, top: `${zone.top}%`, width: `${zone.width}%`, height: `${zone.height}%` }}>{selected ? selectionIndex + 1 : <span aria-hidden="true">·</span>}</button>;
        })}
      </div>
    </div>

    <div className="mt-4 rounded-card border border-line bg-surface p-4">
      <p className="font-semibold">Выбрано рисунков: {selectedZoneIds.length}</p>
      {selectedZoneIds.length > 0 ? <p className="mt-1 text-sm text-muted">Вышивка: <strong className="font-semibold text-foreground">{formatPrice(embroideryPrice)}</strong></p> : null}
    </div>
  </div>;
}
