"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ageGroups, embroideryPlacements, embroiderySizes, materialColors, materialProfiles, messengerUrls, packagingOptions, products, qualityLevels, sizes, threadColorSurchargeOptions } from "@/config/calculator";
import { multiPlacementConfigs } from "@/config/multi-embroidery";
import { calculateMultiEmbroideryPrice, calculateMultiTotalPreliminaryPrice, calculateTotalPreliminaryPrice, getAllowedEmbroiderySizes, getAllowedPlacements, validateCalculatorSelection } from "@/lib/calculator";
import { scheduleCalculatorStepScroll } from "../../lib/calculator-scroll.ts";
import { resolvePublicAssetPath } from "../../lib/public-assets.ts";
import type { AgeGroupId, CalculatorSelectionState, ColorId, CompleteCalculatorSelection, CompleteMultiCalculatorSelection, EmbroideryMode, EmbroideryPlacementId, EmbroiderySizeId, MultiEmbroiderySelectionState, MultiGarmentView, MultiZoneId, PreliminaryPrice, ProductTypeId } from "@/types/calculator";
import { MultiPlacementSelector } from "./multi-placement-selector";
import { OptionCard } from "./option-card";
import { OrderSummary, formatPrice, getCurrentPrice, labelOf } from "./order-summary";
import { ProgressBar } from "./progress-bar";

const TOTAL_STEPS = 9;
const initialSelection: CalculatorSelectionState = { productType: null, ageGroup: null, qualityLevel: null, size: null, color: null, placement: null, embroiderySize: null, threadColors: null, packaging: null };
const questions = [
  ["Что будем создавать?", "Выберите изделие для будущей вышивки."], ["Для кого изделие?", "От этого выбора зависят размеры и цена."],
  ["Выберите качество изделия", "Оба варианта подходят для машинной вышивки."], ["Выберите размер", "Чтобы выбрать точный размер, ориентируйтесь на рост ребёнка."],
  ["Выберите цвет", "Название указано рядом с каждым образцом."], ["Где разместить рисунок?", "Доступные места зависят от изделия."],
  ["Выберите размер рисунка", "Пропорции зависят от формы исходного рисунка."], ["Сколько цветов в рисунке?", "Если сомневаетесь, выберите «Не знаю»."],
  ["Как упаковать заказ?", "Базовая упаковка уже входит в стоимость."],
] as const;
const productImageSources: Record<ProductTypeId, string> = {
  "t-shirt": resolvePublicAssetPath("/images/products/tshirt.jpg"),
  sweatshirt: resolvePublicAssetPath("/images/products/sweatshirt.png"),
  hoodie: resolvePublicAssetPath("/images/products/hoodie.png"),
  "zip-hoodie": resolvePublicAssetPath("/images/products/zip-hoodie.png"),
};
const productColorImageSources: Partial<Record<ProductTypeId, Record<ColorId, string>>> = {
  "t-shirt": {
    white: resolvePublicAssetPath("/images/products/tshirt/colors/white.png"),
    "gray-melange": resolvePublicAssetPath("/images/products/tshirt/colors/gray-melange.png"),
    black: resolvePublicAssetPath("/images/products/tshirt/colors/black.png"),
    red: resolvePublicAssetPath("/images/products/tshirt/colors/red.png"),
    blue: resolvePublicAssetPath("/images/products/tshirt/colors/blue.png"),
    green: resolvePublicAssetPath("/images/products/tshirt/colors/green.png"),
    yellow: resolvePublicAssetPath("/images/products/tshirt/colors/yellow.png"),
  },
  sweatshirt: {
    white: resolvePublicAssetPath("/images/products/sweatshirt/colors/sw-white.png"),
    "gray-melange": resolvePublicAssetPath("/images/products/sweatshirt/colors/sw-gray-melange.png"),
    black: resolvePublicAssetPath("/images/products/sweatshirt/colors/sw-black.png"),
    red: resolvePublicAssetPath("/images/products/sweatshirt/colors/sw-red.png"),
    blue: resolvePublicAssetPath("/images/products/sweatshirt/colors/sw-blue.png"),
    green: resolvePublicAssetPath("/images/products/sweatshirt/colors/sw-green.png"),
    yellow: resolvePublicAssetPath("/images/products/sweatshirt/colors/sw-yellow.png"),
  },
  hoodie: {
    white: resolvePublicAssetPath("/images/products/hoodie/colors/h-white.png"),
    "gray-melange": resolvePublicAssetPath("/images/products/hoodie/colors/h-gray-melange.png"),
    black: resolvePublicAssetPath("/images/products/hoodie/colors/h-black.png"),
    red: resolvePublicAssetPath("/images/products/hoodie/colors/h-red.png"),
    blue: resolvePublicAssetPath("/images/products/hoodie/colors/h-blue.png"),
    green: resolvePublicAssetPath("/images/products/hoodie/colors/h-green.png"),
    yellow: resolvePublicAssetPath("/images/products/hoodie/colors/h-yellow.png"),
  },
  "zip-hoodie": {
    white: resolvePublicAssetPath("/images/products/zip-hoodie/colors/z-white.png"),
    "gray-melange": resolvePublicAssetPath("/images/products/zip-hoodie/colors/z-gray-melange.png"),
    black: resolvePublicAssetPath("/images/products/zip-hoodie/colors/z-black.png"),
    red: resolvePublicAssetPath("/images/products/zip-hoodie/colors/z-red.png"),
    blue: resolvePublicAssetPath("/images/products/zip-hoodie/colors/z-blue.png"),
    green: resolvePublicAssetPath("/images/products/zip-hoodie/colors/z-green.png"),
    yellow: resolvePublicAssetPath("/images/products/zip-hoodie/colors/z-yellow.png"),
  },
};
const placementImageSources: Partial<Record<ProductTypeId, Partial<Record<EmbroideryPlacementId, string>>>> = {
  "t-shirt": {
    chest: resolvePublicAssetPath("/images/placements/tshirt/chest.png"),
    back: resolvePublicAssetPath("/images/placements/tshirt/back.png"),
    sleeve: resolvePublicAssetPath("/images/placements/tshirt/sleeve.png"),
  },
  sweatshirt: {
    chest: resolvePublicAssetPath("/images/placements/sweatshirt/chest.png"),
    back: resolvePublicAssetPath("/images/placements/sweatshirt/back.png"),
    sleeve: resolvePublicAssetPath("/images/placements/sweatshirt/sleeve.png"),
  },
  hoodie: {
    chest: resolvePublicAssetPath("/images/placements/hoodie/chest.png"),
    back: resolvePublicAssetPath("/images/placements/hoodie/back.png"),
    sleeve: resolvePublicAssetPath("/images/placements/hoodie/sleeve.png"),
  },
  "zip-hoodie": {
    "zip-left": resolvePublicAssetPath("/images/placements/zip-hoodie/left-chest.png"),
    "zip-right": resolvePublicAssetPath("/images/placements/zip-hoodie/right-chest.png"),
    back: resolvePublicAssetPath("/images/placements/zip-hoodie/back.png"),
    sleeve: resolvePublicAssetPath("/images/placements/zip-hoodie/sleeve.png"),
  },
};
const multiPlacementPreviewImageSources: Partial<Record<ProductTypeId, string>> = {
  hoodie: resolvePublicAssetPath("/images/placements/multi/hoodie/multi.jpeg"),
  sweatshirt: resolvePublicAssetPath("/images/placements/multi/sweatshirt/multi.jpeg"),
  "zip-hoodie": resolvePublicAssetPath("/images/placements/multi/zip-hoodie/multi.jpeg"),
};
const packagingImageSources: Record<(typeof packagingOptions)[number]["id"], string> = {
  basic: resolvePublicAssetPath("/images/packaging/basic.png"),
  gift: resolvePublicAssetPath("/images/packaging/gift.png"),
};

const generateOrderNumber = () => `EMB-${Math.floor(1000 + Math.random() * 9000)}`;
const complete = (selection: CalculatorSelectionState): selection is CompleteCalculatorSelection => validateCalculatorSelection(selection).isCompatible;
const completeMulti = (selection: CalculatorSelectionState, multiSelection: MultiEmbroiderySelectionState): CompleteMultiCalculatorSelection | null => {
  if (multiSelection.mode !== "multi" || !selection.productType || !multiPlacementConfigs[selection.productType] || multiSelection.zoneIds.length < 2 || !selection.ageGroup || !selection.qualityLevel || !selection.size || !selection.color || !selection.packaging) return null;
  return { productType: selection.productType, ageGroup: selection.ageGroup, qualityLevel: selection.qualityLevel, size: selection.size, color: selection.color, packaging: selection.packaging, multiZoneIds: multiSelection.zoneIds };
};

export function Calculator() {
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<CalculatorSelectionState>(initialSelection);
  const [multiSelection, setMultiSelection] = useState<MultiEmbroiderySelectionState>({ mode: null, zoneIds: [] });
  const [multiView, setMultiView] = useState<MultiGarmentView>("front");
  const [multiSelectorOpen, setMultiSelectorOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const stepContainerRef = useRef<HTMLDivElement>(null);
  const stepKey = `${step}:${multiSelectorOpen}`;
  const previousStepKey = useRef(stepKey);
  useLayoutEffect(() => {
    // No scrolling on mount or parameter changes, including view/zone selection.
    if (previousStepKey.current === stepKey) return;
    previousStepKey.current = stepKey;
    const heading = stepContainerRef.current?.querySelector<HTMLElement>("[data-calculator-step-heading]");
    if (!heading) return;
    return scheduleCalculatorStepScroll(heading, document.querySelector<HTMLElement>("[data-site-header]"));
  }, [stepKey]);
  const patch = (value: Partial<CalculatorSelectionState>) => setSelection((current) => ({ ...current, ...value }));

  const selectProduct = (productType: ProductTypeId) => {
    setMultiSelection((current) => ({ mode: productType === "t-shirt" && current.mode === "multi" ? null : current.mode, zoneIds: productType === selection.productType ? current.zoneIds : [] }));
    setMultiSelectorOpen(false);
    setSelection((current) => {
      const placement = current.placement && getAllowedPlacements(productType).includes(current.placement) ? current.placement : null;
      const allowed = placement && current.ageGroup ? getAllowedEmbroiderySizes(productType, current.ageGroup, placement) : [];
      return { ...current, productType, placement, embroiderySize: current.embroiderySize && allowed.includes(current.embroiderySize) ? current.embroiderySize : null };
    });
  };
  const selectAgeGroup = (ageGroup: AgeGroupId) => setSelection((current) => {
    const size = current.size && sizes.some((item) => item.id === current.size && item.ageGroup === ageGroup) ? current.size : null;
    const allowed = current.productType && current.placement ? getAllowedEmbroiderySizes(current.productType, ageGroup, current.placement) : [];
    return { ...current, ageGroup, size, embroiderySize: current.embroiderySize && allowed.includes(current.embroiderySize) ? current.embroiderySize : null };
  });
  const selectPlacement = (placement: EmbroideryPlacementId) => {
    setMultiSelection((current) => ({ ...current, mode: "single" }));
    setSelection((current) => {
      const allowed = current.productType && current.ageGroup ? getAllowedEmbroiderySizes(current.productType, current.ageGroup, placement) : [];
      return { ...current, placement, embroiderySize: current.embroiderySize && allowed.includes(current.embroiderySize) ? current.embroiderySize : null };
    });
  };
  const selectMultiPlacement = () => {
    setMultiSelection((current) => ({ mode: "multi", zoneIds: current.zoneIds }));
    setSelection((current) => ({ ...current, placement: null, embroiderySize: null, threadColors: null, packaging: null }));
  };
  const toggleMultiZone = (zoneId: MultiZoneId) => setMultiSelection((current) => ({ ...current, zoneIds: current.zoneIds.includes(zoneId) ? current.zoneIds.filter((id) => id !== zoneId) : [...current.zoneIds, zoneId] }));

  const currentValue = [selection.productType, selection.ageGroup, selection.qualityLevel, selection.size, selection.color, selection.placement, selection.embroiderySize, selection.threadColors, selection.packaging][step];
  const multiConfig = selection.productType ? multiPlacementConfigs[selection.productType] : undefined;
  const canContinue = multiSelectorOpen ? multiSelection.zoneIds.length >= 2 : step < TOTAL_STEPS && (step === 5 ? (multiSelection.mode === "single" && selection.placement !== null) || (multiSelection.mode === "multi" && Boolean(multiConfig)) : currentValue !== null);
  const continueFlow = () => {
    if (!canContinue) return;
    if (multiSelectorOpen) {
      setMultiSelectorOpen(false);
      setStep(8);
      setCopyStatus("idle");
      return;
    }
    if (step === 5 && multiSelection.mode === "multi" && multiConfig) {
      setMultiView("front");
      setMultiSelectorOpen(true);
      setCopyStatus("idle");
      return;
    }
    if (step === TOTAL_STEPS - 1) {
      if (multiSelection.mode === "multi" ? !completeMulti(selection, multiSelection) : !complete(selection)) return;
      setOrderNumber((value) => value ?? generateOrderNumber());
    }
    setStep((value) => Math.min(value + 1, TOTAL_STEPS));
    setCopyStatus("idle");
  };
  const goBack = () => {
    if (multiSelectorOpen) { setMultiSelectorOpen(false); return; }
    if (step === 8 && multiSelection.mode === "multi" && multiConfig) { setStep(5); setMultiSelectorOpen(true); return; }
    setStep((value) => Math.max(0, value - 1));
  };
  const finalSingleSelection = multiSelection.mode !== "multi" && complete(selection) ? selection : null;
  const finalMultiSelection = completeMulti(selection, multiSelection);
  const finalSelection = finalMultiSelection ?? finalSingleSelection;
  const price = finalMultiSelection ? calculateMultiTotalPreliminaryPrice(finalMultiSelection) : finalSingleSelection ? calculateTotalPreliminaryPrice(finalSingleSelection) : null;
  const message = finalSelection && orderNumber && price ? buildOrderMessage(finalSelection, orderNumber, price.total) : "";
  const copyOrder = async () => {
    try { await navigator.clipboard.writeText(message); setCopyStatus("copied"); }
    catch { setCopyStatus("error"); }
  };

  return (
    <section className="mx-auto w-full max-w-6xl" style={{ overflowAnchor: "none" }} aria-label="Калькулятор стоимости">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div ref={stepContainerRef} className="min-w-0 rounded-container border border-line bg-surface p-4 shadow-surface min-[360px]:p-5 sm:p-8">
          {step < TOTAL_STEPS ? <>
            <ProgressBar step={multiSelectorOpen ? 7 : step + 1} total={TOTAL_STEPS} />
            <header className="mb-7 mt-8"><h2 data-calculator-step-heading tabIndex={-1} className="outline-none text-[clamp(1.4rem,6vw,1.875rem)] font-semibold leading-tight tracking-tight">{multiSelectorOpen ? "Выберите места для рисунков" : questions[step][0]}</h2><p className="mt-2 text-sm leading-6 text-muted sm:text-base">{multiSelectorOpen ? "Можно выбрать несколько зон. Каждый рисунок — до формата A6." : questions[step][1]}</p></header>
            {multiSelectorOpen && multiConfig ? <MultiPlacementSelector config={multiConfig} productLabel={labelOf(products, selection.productType) ?? "Изделие"} view={multiView} selectedZoneIds={multiSelection.zoneIds} embroideryPrice={calculateMultiEmbroideryPrice(multiSelection.zoneIds.length)} onViewChange={setMultiView} onToggleZone={toggleMultiZone} /> : <Step step={step} selection={selection} embroideryMode={multiSelection.mode} patch={patch} selectProduct={selectProduct} selectAgeGroup={selectAgeGroup} selectPlacement={selectPlacement} selectMultiPlacement={selectMultiPlacement} />}
            <Navigation step={multiSelectorOpen ? 6 : step} canContinue={canContinue} onBack={goBack} onContinue={continueFlow} />
          </> : finalSelection && price && orderNumber ? <Summary selection={finalSelection} multiSelection={finalMultiSelection ? multiSelection : undefined} orderNumber={orderNumber} price={price} message={message} copyStatus={copyStatus} onCopy={copyOrder} onBack={() => setStep(8)} /> : null}
        </div>
        <div className="sticky top-6 hidden lg:block"><OrderSummary selection={selection} multiSelection={multiSelection} /></div>
      </div>
      {step < TOTAL_STEPS ? <>
        {mobileSummaryOpen ? <>
          <button type="button" aria-label="Закрыть состав заказа" onClick={() => setMobileSummaryOpen(false)} className="fixed inset-0 z-20 bg-foreground/20 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-accent-secondary sm:hidden" />
          <div id="mobile-order-summary" className="fixed inset-x-2.5 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-30 flex max-h-[72dvh] flex-col overflow-hidden rounded-container border border-line bg-surface shadow-surface min-[360px]:inset-x-4 sm:hidden" role="region" aria-label="Текущий выбор">
            <div className="z-10 flex shrink-0 items-center justify-between border-b border-line bg-surface px-5 py-3"><strong>Текущий заказ</strong><button type="button" onClick={() => setMobileSummaryOpen(false)} className="min-h-11 rounded-button border border-line bg-surface px-3 text-sm font-semibold hover:bg-background focus-visible:outline-3 focus-visible:outline-accent-secondary">Закрыть</button></div>
            <div className="min-h-0 overflow-y-auto overscroll-contain p-1"><OrderSummary selection={selection} multiSelection={multiSelection} /></div>
          </div>
        </> : null}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-floating sm:hidden"><div className="mx-auto flex max-w-6xl items-center gap-2">
          {step > 0 || multiSelectorOpen ? <button type="button" aria-label="Назад" onClick={() => { setMobileSummaryOpen(false); goBack(); }} className="min-h-12 shrink-0 rounded-button border border-line bg-surface px-3 text-sm font-semibold hover:bg-background active:bg-line focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary">Назад</button> : null}
          <button type="button" aria-expanded={mobileSummaryOpen} aria-controls="mobile-order-summary" onClick={() => setMobileSummaryOpen((value) => !value)} className="min-h-12 min-w-0 flex-1 rounded-button px-1 text-left hover:bg-background focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary"><span className="block truncate text-[11px] font-medium leading-4 text-muted">Предварительно · состав заказа</span><strong className="block truncate text-base font-semibold leading-5">{getCurrentPrice(selection, multiSelection) ? formatPrice(getCurrentPrice(selection, multiSelection)) : "—"}</strong></button>
          <button type="button" onClick={() => { setMobileSummaryOpen(false); continueFlow(); }} disabled={!canContinue} className="min-h-12 shrink-0 rounded-button bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover active:bg-accent-pressed focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary disabled:cursor-not-allowed disabled:bg-line disabled:text-muted">Далее</button>
        </div></div>
      </> : null}
    </section>
  );
}

function Navigation({ step, canContinue, onBack, onContinue }: { step: number; canContinue: boolean; onBack: () => void; onContinue: () => void }) {
  return <div className="mt-8 hidden items-center justify-between border-t border-line pt-6 sm:flex"><button type="button" onClick={onBack} disabled={step === 0} className="rounded-button border border-line bg-surface px-5 py-3 font-semibold hover:bg-background active:bg-line focus-visible:outline-3 focus-visible:outline-accent-secondary disabled:opacity-30">Назад</button><button type="button" onClick={onContinue} disabled={!canContinue} className="rounded-button bg-accent px-7 py-3 font-semibold text-white hover:bg-accent-hover active:bg-accent-pressed focus-visible:outline-3 focus-visible:outline-accent-secondary disabled:cursor-not-allowed disabled:bg-line disabled:text-muted">{step === 8 ? "К итогу" : "Продолжить"}</button></div>;
}

interface StepProps { step: number; selection: CalculatorSelectionState; embroideryMode: EmbroideryMode | null; patch: (value: Partial<CalculatorSelectionState>) => void; selectProduct: (value: ProductTypeId) => void; selectAgeGroup: (value: AgeGroupId) => void; selectPlacement: (value: EmbroideryPlacementId) => void; selectMultiPlacement: () => void }
function Step({ step, selection, embroideryMode, patch, selectProduct, selectAgeGroup, selectPlacement, selectMultiPlacement }: StepProps) {
  const grid = "grid gap-3 sm:grid-cols-2";
  if (step === 0) return <div className={grid}>{products.map((item) => <OptionCard key={item.id} title={item.label} selected={selection.productType === item.id} onSelect={() => selectProduct(item.id)} meta={`от ${formatPrice(Math.min(...Object.values(item.prices).flatMap(Object.values)))}`} visual={<ProductVisual productType={item.id} label={item.label} />} />)}</div>;
  if (step === 1) return <div className={grid}>{ageGroups.map((item) => <OptionCard key={item.id} title={item.label} description={item.id === "child" ? "Размеры 98–104 — 146–156" : "Размеры S — XL"} selected={selection.ageGroup === item.id} onSelect={() => selectAgeGroup(item.id)} />)}</div>;
  if (step === 2) return <div className={grid}>{qualityLevels.map((item) => { const material = materialProfiles.find((profile) => profile.qualityLevel === item.id && selection.productType && (profile.productTypes as readonly ProductTypeId[]).includes(selection.productType)); const product = products.find((value) => value.id === selection.productType); const price = product && selection.ageGroup ? product.prices[selection.ageGroup][item.id] : null; const explanation = selection.productType === "t-shirt" ? item.id === "standard" ? "Плотная и комфортная футболка на каждый день" : "Более плотная и гладкая ткань, лучше держит форму" : null; return <OptionCard key={item.id} title={item.label} description={material ? <><span>{material.description}</span>{explanation ? <span className="mt-1.5 block text-xs leading-4 opacity-80">{explanation}</span> : null}</> : undefined} meta={price ? formatPrice(price) : undefined} selected={selection.qualityLevel === item.id} onSelect={() => patch({ qualityLevel: item.id })} />; })}</div>;
  if (step === 3) return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{sizes.filter((item) => item.ageGroup === selection.ageGroup).map((item) => <OptionCard key={item.id} title={item.label} selected={selection.size === item.id} onSelect={() => patch({ size: item.id })} />)}</div>;
  if (step === 4) {
    const imageSources = selection.productType ? productColorImageSources[selection.productType] : undefined;
    return imageSources && selection.productType ? <ProductColorSelector productType={selection.productType} imageSources={imageSources} selectedColor={selection.color} onSelect={(color) => patch({ color })} /> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{materialColors.map((item) => <OptionCard key={item.id} title={item.label} selected={selection.color === item.id} onSelect={() => patch({ color: item.id })} visual={<span aria-hidden="true" className="h-12 w-12 rounded-full border border-black/15 shadow-inner" style={{ backgroundColor: item.swatch }} />} />)}</div>;
  }
  if (step === 5) return <div className={grid}>{(selection.productType ? getAllowedPlacements(selection.productType) : []).map((id) => { const item = embroideryPlacements.find((value) => value.id === id); return item ? <OptionCard key={id} title={item.label} selected={embroideryMode === "single" && selection.placement === id} onSelect={() => selectPlacement(id)} visual={<PlacementVisual productType={selection.productType} placement={id} />} /> : null; })}{selection.productType && selection.productType !== "t-shirt" ? <OptionCard title="Несколько рисунков" description="Разместите несколько вышивок по всему изделию" selected={embroideryMode === "multi"} onSelect={selectMultiPlacement} visual={<MultiPlacementVisual productType={selection.productType} />} /> : null}</div>;
  if (step === 6) { const allowed = selection.productType && selection.ageGroup && selection.placement ? getAllowedEmbroiderySizes(selection.productType, selection.ageGroup, selection.placement) : []; return <div className={grid}>{embroiderySizes.filter((item) => allowed.includes(item.id)).map((item) => <EmbroiderySizeCard key={item.id} size={item.id} label={item.label} dimensions={item.dimensionsCm} price={item.price} selected={selection.embroiderySize === item.id} onSelect={() => patch({ embroiderySize: item.id })} />)}</div>; }
  if (step === 7) return <div className={grid}>{threadColorSurchargeOptions.map((item) => {
    const description = item.id === "seven-plus" ? "Точную стоимость уточним по рисунку" : item.id === "unknown" ? "Уточним после просмотра рисунка" : undefined;
    const priceLabel = item.id === "seven-plus" ? `от +${formatPrice(item.surcharge)}` : item.id === "unknown" ? `предварительно +${formatPrice(item.surcharge)}` : item.surcharge ? `+${formatPrice(item.surcharge)}` : "Без доплаты";
    return <OptionCard key={item.id} title={item.label} description={description} meta={priceLabel} selected={selection.threadColors === item.id} onSelect={() => patch({ threadColors: item.id })} />;
  })}</div>;
  return <div className={grid}>{packagingOptions.map((item) => <OptionCard key={item.id} title={item.label} description={item.description} meta={item.price ? `+ ${formatPrice(item.price)}` : "Включено"} selected={selection.packaging === item.id} onSelect={() => patch({ packaging: item.id })} visual={<PackagingVisual source={packagingImageSources[item.id]} />} />)}</div>;
}

const embroideryIndicatorSizes: Record<EmbroiderySizeId, string> = {
  A6: "h-12 w-8",
  A5: "h-[63px] w-[45px]",
  A4: "h-20 w-14",
};

function EmbroiderySizeCard({ size, label, dimensions, price, selected, onSelect }: { size: EmbroiderySizeId; label: string; dimensions: string; price: number; selected: boolean; onSelect: () => void }) {
  return <button type="button" aria-pressed={selected} onClick={onSelect} className={`relative flex min-h-28 w-full items-center justify-between gap-4 rounded-card border p-4 text-left transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-secondary ${selected ? "border-accent bg-accent-light text-foreground" : "border-line bg-surface text-foreground hover:border-muted hover:bg-[#fcfbf8]"}`}>
    {selected ? <span aria-hidden="true" className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">✓</span> : null}
    <span className="flex min-w-0 flex-col">
      <span className="text-lg font-semibold leading-tight">{label}</span>
      <span className="mt-1 text-sm leading-5 text-muted">{dimensions}</span>
      <span className="mt-2 text-sm font-semibold">+{formatPrice(price)}</span>
    </span>
    <span aria-hidden="true" className="flex h-20 w-16 shrink-0 items-center justify-center">
      <span className={`rounded-[3px] border-2 border-accent/70 ${embroideryIndicatorSizes[size]}`} />
    </span>
  </button>;
}

function ProductColorSelector({ productType, imageSources, selectedColor, onSelect }: { productType: ProductTypeId; imageSources: Record<ColorId, string>; selectedColor: ColorId | null; onSelect: (color: ColorId) => void }) {
  const previewColor = selectedColor ?? "white";
  const selectedLabel = materialColors.find((item) => item.id === selectedColor)?.label;
  const productLabel = products.find((item) => item.id === productType)?.label ?? "Изделие";

  return <div className="mx-auto w-full max-w-xl">
    <div className="relative mx-auto aspect-[5/4] w-full max-w-md overflow-hidden rounded-card border border-line bg-background p-4 sm:p-5">
      <Image src={imageSources[previewColor]} alt={`${productLabel}, цвет ${selectedLabel ?? "белый"}`} fill sizes="(max-width: 640px) calc(100vw - 3rem), 448px" className="object-contain p-4 sm:p-5" />
    </div>
    <div className="mt-5">
      <p className="text-sm text-muted">Выбранный цвет</p>
      <p className="mt-1 min-h-6 font-semibold" aria-live="polite">{selectedLabel ?? "Цвет не выбран"}</p>
      <div className="mt-3 flex flex-wrap gap-3" role="group" aria-label={`Цвет: ${productLabel.toLowerCase()}`}>
        {materialColors.map((item) => {
          const selected = selectedColor === item.id;
          return <button key={item.id} type="button" aria-label={item.label} aria-pressed={selected} onClick={() => onSelect(item.id)} className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-surface transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary ${selected ? "border-accent ring-2 ring-accent ring-offset-2 ring-offset-surface" : "border-line hover:border-muted"}`}>
            <span aria-hidden="true" className="absolute inset-1 rounded-full border border-black/15 shadow-inner" style={{ backgroundColor: item.swatch }} />
            {selected ? <span aria-hidden="true" className={`relative text-sm font-bold ${item.id === "white" || item.id === "yellow" || item.id === "gray-melange" ? "text-foreground" : "text-white"}`}>✓</span> : null}
          </button>;
        })}
      </div>
      <p className="mt-5 text-xs leading-5 text-muted sm:text-sm">Обратите внимание: оттенок ткани на экране может немного отличаться от реального из-за настроек дисплея и освещения при съёмке.</p>
    </div>
  </div>;
}

function Placeholder({ label, small = false }: { label: string; small?: boolean }) { return <span aria-hidden="true" className={`flex w-full items-center justify-center rounded-small border border-dashed border-line bg-background text-xs text-muted ${small ? "h-14 sm:h-16" : "h-20 sm:h-24"}`}>{label}</span>; }

function PlacementVisual({ productType, placement }: { productType: ProductTypeId | null; placement: EmbroideryPlacementId }) {
  const source = productType ? placementImageSources[productType]?.[placement] : undefined;
  if (!source) return <Placeholder label="Зона вышивки" small />;

  return <span aria-hidden="true" className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-small border border-line bg-background p-3 sm:aspect-[4/3]">
    <Image src={source} alt="" fill sizes="(max-width: 640px) calc(100vw - 3rem), 320px" className="object-contain p-3" />
  </span>;
}

function MultiPlacementVisual({ productType }: { productType: ProductTypeId }) {
  const source = multiPlacementPreviewImageSources[productType];
  if (!source) return <Placeholder label="Несколько зон вышивки" small />;

  return <span aria-hidden="true" className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-small border border-line bg-background p-3 sm:aspect-[4/3]">
    <Image src={source} alt="" fill sizes="(max-width: 640px) calc(100vw - 3rem), 320px" className="object-contain p-3" />
  </span>;
}

function PackagingVisual({ source }: { source: string }) {
  return <span aria-hidden="true" className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-small border border-line bg-background p-3">
    <Image src={source} alt="" fill sizes="(max-width: 640px) calc(100vw - 3rem), 320px" className="object-contain p-3" />
  </span>;
}

function ProductVisual({ productType, label }: { productType: ProductTypeId; label: string }) {
  return <span className="relative mx-auto flex aspect-[4/5] w-full max-w-60 items-center justify-center overflow-hidden rounded-small border border-line bg-background p-3"><Image src={productImageSources[productType]} alt={`${label}, вид изделия`} fill sizes="240px" className="object-contain p-3" /></span>;
}

interface SummaryProps { selection: CompleteCalculatorSelection | CompleteMultiCalculatorSelection; multiSelection?: MultiEmbroiderySelectionState; orderNumber: string; price: PreliminaryPrice; message: string; copyStatus: "idle" | "copied" | "error"; onCopy: () => void; onBack: () => void }
function Summary({ selection, multiSelection, orderNumber, price, message, copyStatus, onCopy, onBack }: SummaryProps) {
  const isMulti = "multiZoneIds" in selection;
  const sharedRows = [["Изделие", `${labelOf(ageGroups, selection.ageGroup)} · ${labelOf(products, selection.productType)}`], ["Качество", labelOf(qualityLevels, selection.qualityLevel)], ["Размер", labelOf(sizes, selection.size)], ["Цвет", labelOf(materialColors, selection.color)]];
  const rows = isMulti
    ? [...sharedRows, ["Размещение", "несколько рисунков"], ["Количество рисунков", String(multiSelection?.zoneIds.length ?? selection.multiZoneIds.length)], ["Размер каждой вышивки", "до A6"], ["Упаковка", labelOf(packagingOptions, selection.packaging)]]
    : [...sharedRows, ["Размещение", labelOf(embroideryPlacements, selection.placement)], ["Размер вышивки", labelOf(embroiderySizes, selection.embroiderySize)], ["Количество цветов", labelOf(threadColorSurchargeOptions, selection.threadColors)], ["Упаковка", labelOf(packagingOptions, selection.packaging)]];
  return <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Заявка {orderNumber}</p><h2 data-calculator-step-heading tabIndex={-1} className="outline-none mt-2 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">Ваше изделие готово к оформлению</h2>
    <section className="mt-5" aria-labelledby="selected-parameters"><h3 id="selected-parameters" className="mb-2 text-sm font-semibold">Выбранные параметры</h3><dl className="divide-y divide-line rounded-card border border-line bg-surface px-4">{rows.map(([label, value]) => <div key={label} className="flex justify-between gap-3 py-2.5 text-sm"><dt className="text-muted">{label}</dt><dd className="text-right font-medium">{value}</dd></div>)}</dl></section>
    <section className="mt-5" aria-labelledby="price-breakdown"><h3 id="price-breakdown" className="mb-2 text-sm font-semibold">Расчёт стоимости</h3><div className="rounded-card border border-[#f3c9c2] bg-accent-light p-4"><PriceLine label="Изделие" value={price.baseProduct} /><PriceLine label="Вышивка" value={price.embroidery} />{!isMulti ? <PriceLine label="Доплата за цвета" value={price.threadColorSurcharge} /> : null}<PriceLine label="Упаковка" value={price.packaging} /><div className="mt-3 flex items-end justify-between gap-3 border-t border-[#eeb9b0] pt-3"><span className="font-semibold">Предварительная стоимость</span><strong className="text-right text-xl font-semibold sm:text-2xl">{price.isFromPrice ? "от " : ""}{formatPrice(price.total)}</strong></div></div></section>
    {!isMulti && selection.threadColors === "seven-plus" ? <Notice>Точная стоимость зависит от рисунка и будет рассчитана индивидуально.</Notice> : null}{!isMulti && selection.threadColors === "unknown" ? <Notice>Использована предварительная доплата 500 ₽. Точное количество цветов определим после получения рисунка.</Notice> : null}
    <section className="mt-5 border-t border-line pt-4" aria-labelledby="order-conditions"><h3 id="order-conditions" className="text-sm font-semibold">Условия</h3><div className="mt-2 space-y-1.5 text-sm leading-6 text-muted"><p>Доставка рассчитывается отдельно после уточнения адреса.</p><p>Изготовление занимает от 3–4 рабочих дней после согласования макета.</p><p>Стоимость предварительная. После просмотра рисунка мы подтвердим её до начала работы.</p></div></section>
    <section className="mt-5 border-t border-line pt-4" aria-labelledby="order-actions">
      <h3 id="order-actions" className="text-sm font-semibold">Продолжить оформление</h3>
      <p className="mt-2 text-sm leading-6 text-muted">Остался последний шаг — отправьте детский рисунок. Мы посмотрим его, подтвердим стоимость и подготовим макет вышивки.</p>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        <a href={`${messengerUrls.telegram}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center rounded-button bg-accent px-4 py-3 text-center font-semibold text-white hover:bg-accent-hover active:bg-accent-pressed focus-visible:outline-3 focus-visible:outline-accent-secondary">Отправить рисунок в Telegram</a>
        <a href={messengerUrls.max} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center rounded-button border border-line bg-surface px-4 py-3 text-center font-semibold hover:bg-background active:bg-line focus-visible:outline-3 focus-visible:outline-accent-secondary">Отправить рисунок в MAX</a>
      </div>
      <button type="button" onClick={onCopy} className="mt-3 min-h-12 w-full rounded-button bg-background px-4 py-3 font-medium text-foreground hover:bg-line active:bg-line focus-visible:outline-3 focus-visible:outline-accent-secondary">{copyStatus === "copied" ? "Скопировано" : copyStatus === "error" ? "Не удалось скопировать" : "Скопировать параметры заказа"}</button>
      <p className="mt-2 text-xs leading-5 text-muted">Параметры заказа и предварительная стоимость будут подготовлены для отправки вместе с рисунком.</p>
      <button type="button" onClick={onBack} className="mt-3 min-h-12 w-full rounded-button border border-transparent px-4 py-3 font-semibold text-muted hover:border-line hover:bg-background focus-visible:outline-3 focus-visible:outline-accent-secondary">Изменить параметры</button>
    </section>
    <p className="mt-4 text-sm text-muted" aria-live="polite">{copyStatus === "copied" ? "Параметры заказа скопированы." : copyStatus === "error" ? "Не удалось получить доступ к буферу обмена." : ""}</p>
  </div>;
}
function PriceLine({ label, value }: { label: string; value: number }) { return <div className="flex justify-between py-1.5 text-sm"><span className="text-muted">{label}</span><span>{formatPrice(value)}</span></div>; }
function Notice({ children }: { children: ReactNode }) { return <p className="mt-4 rounded-card border border-[#f3c9c2] bg-accent-light p-4 text-sm leading-6 text-foreground">{children}</p>; }
function buildOrderMessage(selection: CompleteCalculatorSelection | CompleteMultiCalculatorSelection, orderNumber: string, total: number) {
  const packaging = selection.packaging === "basic" ? "базовая" : "подарочная";
  const quality = selection.qualityLevel === "premium" ? "Премиум" : "Стандарт";
  const isMulti = "multiZoneIds" in selection;
  const embroideryDetails = isMulti
    ? `Размещение: несколько рисунков\nКоличество рисунков: ${selection.multiZoneIds.length}\nРазмер каждой вышивки: до A6`
    : `Размещение: ${labelOf(embroideryPlacements, selection.placement)?.toLowerCase()}\nРазмер вышивки: ${labelOf(embroiderySizes, selection.embroiderySize)}\nКоличество цветов: ${labelOf(threadColorSurchargeOptions, selection.threadColors)}`;
  const closing = isMulti
    ? `Выбранные места:\n${selection.multiZoneIds.map((zoneId, index) => `${index + 1}. ${multiPlacementConfigs[selection.productType]?.zones.find((zone) => zone.id === zoneId)?.label ?? zoneId}`).join("\n")}\n\nПрикрепляю рисунки в соответствии с номерами выше для оценки и подготовки макета.`
    : "Прикрепляю детский рисунок для оценки и подготовки макета.";

  return `Здравствуйте! Хочу заказать изделие с вышивкой детского рисунка.\n\nНомер заявки: ${orderNumber}\n\nИзделие: ${labelOf(ageGroups, selection.ageGroup)?.toLowerCase()} ${labelOf(products, selection.productType)?.toLowerCase()}\nВариант: ${quality}\nРазмер: ${labelOf(sizes, selection.size)}\nЦвет: ${labelOf(materialColors, selection.color)?.toLowerCase()}\n${embroideryDetails}\nУпаковка: ${packaging}\n\nПредварительная стоимость: ${formatPrice(total)}\n\n${closing}`;
}
