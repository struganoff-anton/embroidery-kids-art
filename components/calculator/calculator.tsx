"use client";

import { useState, type ReactNode } from "react";
import { ageGroups, embroideryPlacements, embroiderySizes, materialColors, materialProfiles, messengerUrls, packagingOptions, products, qualityLevels, sizes, threadColorSurchargeOptions } from "@/config/calculator";
import { calculateTotalPreliminaryPrice, getAllowedEmbroiderySizes, getAllowedPlacements, validateCalculatorSelection } from "@/lib/calculator";
import type { AgeGroupId, CalculatorSelectionState, CompleteCalculatorSelection, EmbroideryPlacementId, ProductTypeId } from "@/types/calculator";
import { OptionCard } from "./option-card";
import { OrderSummary, formatPrice, getCurrentPrice, labelOf } from "./order-summary";
import { ProgressBar } from "./progress-bar";

const TOTAL_STEPS = 9;
const initialSelection: CalculatorSelectionState = { productType: null, ageGroup: null, qualityLevel: null, size: null, color: null, placement: null, embroiderySize: null, threadColors: null, packaging: null };
const questions = [
  ["Что будем создавать?", "Выберите изделие для будущей вышивки."], ["Для кого изделие?", "От этого выбора зависят размеры и цена."],
  ["Выберите качество изделия", "Оба варианта подходят для машинной вышивки."], ["Выберите размер", "Возраст ориентировочный — лучше сверяться с замерами."],
  ["Выберите цвет", "Название указано рядом с каждым образцом."], ["Где разместить рисунок?", "Доступные места зависят от изделия."],
  ["Выберите размер рисунка", "Пропорции зависят от формы исходного рисунка."], ["Сколько цветов в рисунке?", "Если сомневаетесь, выберите «Не знаю»."],
  ["Как упаковать заказ?", "Базовая упаковка уже входит в стоимость."],
] as const;

const generateOrderNumber = () => `EMB-${Math.floor(1000 + Math.random() * 9000)}`;
const complete = (selection: CalculatorSelectionState): selection is CompleteCalculatorSelection => validateCalculatorSelection(selection).isCompatible;

export function Calculator() {
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<CalculatorSelectionState>(initialSelection);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const patch = (value: Partial<CalculatorSelectionState>) => setSelection((current) => ({ ...current, ...value }));

  const selectProduct = (productType: ProductTypeId) => setSelection((current) => {
    const placement = current.placement && getAllowedPlacements(productType).includes(current.placement) ? current.placement : null;
    const allowed = placement && current.ageGroup ? getAllowedEmbroiderySizes(productType, current.ageGroup, placement) : [];
    return { ...current, productType, placement, embroiderySize: current.embroiderySize && allowed.includes(current.embroiderySize) ? current.embroiderySize : null };
  });
  const selectAgeGroup = (ageGroup: AgeGroupId) => setSelection((current) => {
    const size = current.size && sizes.some((item) => item.id === current.size && item.ageGroup === ageGroup) ? current.size : null;
    const allowed = current.productType && current.placement ? getAllowedEmbroiderySizes(current.productType, ageGroup, current.placement) : [];
    return { ...current, ageGroup, size, embroiderySize: current.embroiderySize && allowed.includes(current.embroiderySize) ? current.embroiderySize : null };
  });
  const selectPlacement = (placement: EmbroideryPlacementId) => setSelection((current) => {
    const allowed = current.productType && current.ageGroup ? getAllowedEmbroiderySizes(current.productType, current.ageGroup, placement) : [];
    return { ...current, placement, embroiderySize: current.embroiderySize && allowed.includes(current.embroiderySize) ? current.embroiderySize : null };
  });

  const currentValue = [selection.productType, selection.ageGroup, selection.qualityLevel, selection.size, selection.color, selection.placement, selection.embroiderySize, selection.threadColors, selection.packaging][step];
  const canContinue = step < TOTAL_STEPS && currentValue !== null;
  const continueFlow = () => {
    if (!canContinue) return;
    if (step === TOTAL_STEPS - 1) {
      if (!complete(selection)) return;
      setOrderNumber((value) => value ?? generateOrderNumber());
    }
    setStep((value) => Math.min(value + 1, TOTAL_STEPS));
    setCopyStatus("idle");
  };
  const finalSelection = complete(selection) ? selection : null;
  const price = finalSelection ? calculateTotalPreliminaryPrice(finalSelection) : null;
  const message = finalSelection && orderNumber ? buildOrderMessage(finalSelection, orderNumber, price?.total ?? 0) : "";
  const copyOrder = async () => {
    try { await navigator.clipboard.writeText(message); setCopyStatus("copied"); }
    catch { setCopyStatus("error"); }
  };

  return (
    <section className="mx-auto w-full max-w-6xl" aria-label="Калькулятор стоимости">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          {step < TOTAL_STEPS ? <>
            <ProgressBar step={step + 1} total={TOTAL_STEPS} />
            <header className="mb-7 mt-8"><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{questions[step][0]}</h2><p className="mt-2 text-sm leading-6 text-stone-500 sm:text-base">{questions[step][1]}</p></header>
            <Step step={step} selection={selection} patch={patch} selectProduct={selectProduct} selectAgeGroup={selectAgeGroup} selectPlacement={selectPlacement} />
            <Navigation step={step} canContinue={canContinue} onBack={() => setStep((value) => Math.max(0, value - 1))} onContinue={continueFlow} />
          </> : finalSelection && price && orderNumber ? <Summary selection={finalSelection} orderNumber={orderNumber} price={price} message={message} copyStatus={copyStatus} onCopy={copyOrder} onBack={() => setStep(8)} /> : null}
        </div>
        <div className="sticky top-6 hidden lg:block"><OrderSummary selection={selection} /></div>
      </div>
      {step < TOTAL_STEPS ? <>
        {mobileSummaryOpen ? <>
          <button type="button" aria-label="Закрыть состав заказа" onClick={() => setMobileSummaryOpen(false)} className="fixed inset-0 z-20 bg-black/20 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-white sm:hidden" />
          <div id="mobile-order-summary" className="fixed inset-x-2.5 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-30 flex max-h-[72dvh] flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl min-[360px]:inset-x-4 sm:hidden" role="region" aria-label="Текущий выбор">
            <div className="z-10 flex shrink-0 items-center justify-between border-b border-stone-200 bg-white px-5 py-3"><strong>Текущий заказ</strong><button type="button" onClick={() => setMobileSummaryOpen(false)} className="min-h-11 rounded-xl px-3 text-sm font-semibold hover:bg-stone-100 focus-visible:outline-3 focus-visible:outline-stone-900">Закрыть</button></div>
            <div className="min-h-0 overflow-y-auto overscroll-contain p-1"><OrderSummary selection={selection} /></div>
          </div>
        </> : null}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur sm:hidden"><div className="mx-auto flex max-w-6xl items-center gap-2">
          {step > 0 ? <button type="button" aria-label="Назад" onClick={() => { setMobileSummaryOpen(false); setStep((value) => Math.max(0, value - 1)); }} className="min-h-12 shrink-0 rounded-xl border border-stone-200 px-3 text-sm font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-stone-900">Назад</button> : null}
          <button type="button" aria-expanded={mobileSummaryOpen} aria-controls="mobile-order-summary" onClick={() => setMobileSummaryOpen((value) => !value)} className="min-h-12 min-w-0 flex-1 rounded-xl px-1 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-stone-900"><span className="block truncate text-[11px] leading-4 text-stone-500">Предварительно · состав заказа</span><strong className="block truncate text-base leading-5">{getCurrentPrice(selection) ? formatPrice(getCurrentPrice(selection)) : "—"}</strong></button>
          <button type="button" onClick={() => { setMobileSummaryOpen(false); continueFlow(); }} disabled={!canContinue} className="min-h-12 shrink-0 rounded-xl bg-stone-900 px-4 text-sm font-semibold text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-stone-900 disabled:bg-stone-300">Далее</button>
        </div></div>
      </> : null}
    </section>
  );
}

function Navigation({ step, canContinue, onBack, onContinue }: { step: number; canContinue: boolean; onBack: () => void; onContinue: () => void }) {
  return <div className="mt-8 hidden items-center justify-between border-t border-stone-200 pt-6 sm:flex"><button type="button" onClick={onBack} disabled={step === 0} className="rounded-xl px-5 py-3 font-semibold hover:bg-stone-100 focus-visible:outline-3 focus-visible:outline-stone-900 disabled:opacity-30">Назад</button><button type="button" onClick={onContinue} disabled={!canContinue} className="rounded-xl bg-stone-900 px-7 py-3 font-semibold text-white focus-visible:outline-3 focus-visible:outline-stone-900 disabled:bg-stone-300">{step === 8 ? "К итогу" : "Продолжить"}</button></div>;
}

interface StepProps { step: number; selection: CalculatorSelectionState; patch: (value: Partial<CalculatorSelectionState>) => void; selectProduct: (value: ProductTypeId) => void; selectAgeGroup: (value: AgeGroupId) => void; selectPlacement: (value: EmbroideryPlacementId) => void }
function Step({ step, selection, patch, selectProduct, selectAgeGroup, selectPlacement }: StepProps) {
  const grid = "grid gap-3 sm:grid-cols-2";
  if (step === 0) return <div className={grid}>{products.map((item) => <OptionCard key={item.id} title={item.label} selected={selection.productType === item.id} onSelect={() => selectProduct(item.id)} meta={`от ${formatPrice(Math.min(...Object.values(item.prices).flatMap(Object.values)))}`} visual={<Placeholder label={item.label} />} />)}</div>;
  if (step === 1) return <div className={grid}>{ageGroups.map((item) => <OptionCard key={item.id} title={item.label} description={item.id === "child" ? "Размеры 98–104 — 146–156" : "Размеры XS — XXL"} selected={selection.ageGroup === item.id} onSelect={() => selectAgeGroup(item.id)} />)}</div>;
  if (step === 2) return <div className={grid}>{qualityLevels.map((item) => { const material = materialProfiles.find((profile) => profile.qualityLevel === item.id && selection.productType && (profile.productTypes as readonly ProductTypeId[]).includes(selection.productType)); const product = products.find((value) => value.id === selection.productType); const price = product && selection.ageGroup ? product.prices[selection.ageGroup][item.id] : null; return <OptionCard key={item.id} title={item.label} description={material ? `${material.fabric} · ${material.density} · ${material.composition}` : undefined} meta={price ? formatPrice(price) : undefined} selected={selection.qualityLevel === item.id} onSelect={() => patch({ qualityLevel: item.id })} />; })}</div>;
  if (step === 3) return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{sizes.filter((item) => item.ageGroup === selection.ageGroup).map((item) => <OptionCard key={item.id} title={item.label} description={"approximateAge" in item ? item.approximateAge : undefined} selected={selection.size === item.id} onSelect={() => patch({ size: item.id })} />)}</div>;
  if (step === 4) return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{materialColors.map((item) => <OptionCard key={item.id} title={item.label} selected={selection.color === item.id} onSelect={() => patch({ color: item.id })} visual={<span aria-hidden="true" className="h-12 w-12 rounded-full border border-black/15 shadow-inner" style={{ backgroundColor: item.swatch }} />} />)}</div>;
  if (step === 5) return <div className={grid}>{(selection.productType ? getAllowedPlacements(selection.productType) : []).map((id) => { const item = embroideryPlacements.find((value) => value.id === id); return item ? <OptionCard key={id} title={item.label} selected={selection.placement === id} onSelect={() => selectPlacement(id)} visual={<Placeholder label="Зона вышивки" small />} /> : null; })}</div>;
  if (step === 6) { const allowed = selection.productType && selection.ageGroup && selection.placement ? getAllowedEmbroiderySizes(selection.productType, selection.ageGroup, selection.placement) : []; return <div className={grid}>{embroiderySizes.filter((item) => allowed.includes(item.id)).map((item) => <OptionCard key={item.id} title={item.label} description={item.dimensionsCm} meta={formatPrice(item.price)} selected={selection.embroiderySize === item.id} onSelect={() => patch({ embroiderySize: item.id })} />)}</div>; }
  if (step === 7) return <div className={grid}>{threadColorSurchargeOptions.map((item) => <OptionCard key={item.id} title={item.label} description={item.requiresIndividualCalculation ? "Индивидуальный расчёт" : item.id === "unknown" ? "Уточним после просмотра рисунка" : undefined} meta={item.surcharge ? `+ ${formatPrice(item.surcharge)}` : "Без доплаты"} selected={selection.threadColors === item.id} onSelect={() => patch({ threadColors: item.id })} />)}</div>;
  return <div className={grid}>{packagingOptions.map((item) => <OptionCard key={item.id} title={item.label} description={item.description} meta={item.price ? `+ ${formatPrice(item.price)}` : "Включено"} selected={selection.packaging === item.id} onSelect={() => patch({ packaging: item.id })} visual={<Placeholder label="Упаковка" small />} />)}</div>;
}

function Placeholder({ label, small = false }: { label: string; small?: boolean }) { return <span aria-hidden="true" className={`flex w-full items-center justify-center rounded-xl border border-dashed border-current/25 bg-current/5 text-xs opacity-60 ${small ? "h-14 sm:h-16" : "h-20 sm:h-24"}`}>{label}</span>; }

interface SummaryProps { selection: CompleteCalculatorSelection; orderNumber: string; price: ReturnType<typeof calculateTotalPreliminaryPrice>; message: string; copyStatus: "idle" | "copied" | "error"; onCopy: () => void; onBack: () => void }
function Summary({ selection, orderNumber, price, message, copyStatus, onCopy, onBack }: SummaryProps) {
  const rows = [["Изделие", `${labelOf(ageGroups, selection.ageGroup)} · ${labelOf(products, selection.productType)}`], ["Качество", labelOf(qualityLevels, selection.qualityLevel)], ["Размер", labelOf(sizes, selection.size)], ["Цвет", labelOf(materialColors, selection.color)], ["Размещение", labelOf(embroideryPlacements, selection.placement)], ["Размер вышивки", labelOf(embroiderySizes, selection.embroiderySize)], ["Количество цветов", labelOf(threadColorSurchargeOptions, selection.threadColors)], ["Упаковка", labelOf(packagingOptions, selection.packaging)]];
  return <div><p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Заявка {orderNumber}</p><h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">Ваше изделие готово к оформлению</h2>
    <section className="mt-5" aria-labelledby="selected-parameters"><h3 id="selected-parameters" className="mb-2 text-sm font-semibold">Выбранные параметры</h3><dl className="divide-y divide-stone-200 rounded-2xl border border-stone-200 px-4">{rows.map(([label, value]) => <div key={label} className="flex justify-between gap-3 py-2.5 text-sm"><dt className="text-stone-500">{label}</dt><dd className="text-right font-medium">{value}</dd></div>)}</dl></section>
    <section className="mt-5" aria-labelledby="price-breakdown"><h3 id="price-breakdown" className="mb-2 text-sm font-semibold">Расчёт стоимости</h3><div className="rounded-2xl bg-stone-100 p-4"><PriceLine label="Изделие" value={price.baseProduct} /><PriceLine label="Вышивка" value={price.embroidery} /><PriceLine label="Доплата за цвета" value={price.threadColorSurcharge} /><PriceLine label="Упаковка" value={price.packaging} /><div className="mt-3 flex items-end justify-between gap-3 border-t border-stone-300 pt-3"><span className="font-semibold">Предварительная стоимость</span><strong className="text-right text-xl sm:text-2xl">{price.isFromPrice ? "от " : ""}{formatPrice(price.total)}</strong></div></div></section>
    {selection.threadColors === "seven-plus" ? <Notice>Точная стоимость зависит от рисунка и будет рассчитана индивидуально.</Notice> : null}{selection.threadColors === "unknown" ? <Notice>Использована предварительная доплата 1 000 ₽. Точное количество цветов определим после получения рисунка.</Notice> : null}
    <section className="mt-5 border-t border-stone-200 pt-4" aria-labelledby="order-conditions"><h3 id="order-conditions" className="text-sm font-semibold">Условия</h3><div className="mt-2 space-y-1.5 text-sm leading-6 text-stone-600"><p>Доставка рассчитывается отдельно после уточнения адреса.</p><p>Изготовление занимает от 3–4 рабочих дней после согласования макета.</p><p>Окончательную стоимость подтвердим после просмотра рисунка.</p></div></section>
    <section className="mt-5 border-t border-stone-200 pt-4" aria-labelledby="order-actions"><h3 id="order-actions" className="mb-3 text-sm font-semibold">Продолжить оформление</h3><div className="grid gap-2.5 sm:grid-cols-2"><button type="button" onClick={onCopy} className="min-h-12 rounded-xl border border-stone-300 px-4 py-3 font-semibold focus-visible:outline-3 focus-visible:outline-stone-900">{copyStatus === "copied" ? "Скопировано" : copyStatus === "error" ? "Не удалось скопировать" : "Скопировать параметры заказа"}</button><a href={`${messengerUrls.telegram}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-center font-semibold text-white focus-visible:outline-3 focus-visible:outline-stone-900">Открыть Telegram</a><a href={messengerUrls.max} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center rounded-xl border border-stone-300 px-4 py-3 text-center font-semibold focus-visible:outline-3 focus-visible:outline-stone-900">Открыть MAX</a><button type="button" onClick={onBack} className="min-h-12 rounded-xl px-4 py-3 font-semibold text-stone-600 focus-visible:outline-3 focus-visible:outline-stone-900">Изменить параметры</button></div></section>
    <p className="mt-4 text-sm text-stone-500" aria-live="polite">{copyStatus === "copied" ? "Параметры заказа скопированы." : copyStatus === "error" ? "Не удалось получить доступ к буферу обмена." : ""}</p>
  </div>;
}
function PriceLine({ label, value }: { label: string; value: number }) { return <div className="flex justify-between py-1.5 text-sm"><span className="text-stone-500">{label}</span><span>{formatPrice(value)}</span></div>; }
function Notice({ children }: { children: ReactNode }) { return <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">{children}</p>; }
function buildOrderMessage(selection: CompleteCalculatorSelection, orderNumber: string, total: number) { return `Здравствуйте! Хочу заказать изделие с вышивкой детского рисунка.\n\nНомер заявки: ${orderNumber}\n\nИзделие: ${labelOf(ageGroups, selection.ageGroup)?.toLowerCase()} ${labelOf(products, selection.productType)?.toLowerCase()}\nВариант: ${labelOf(qualityLevels, selection.qualityLevel)}\nРазмер: ${labelOf(sizes, selection.size)}\nЦвет: ${labelOf(materialColors, selection.color)?.toLowerCase()}\nРазмещение: ${labelOf(embroideryPlacements, selection.placement)?.toLowerCase()}\nРазмер вышивки: ${labelOf(embroiderySizes, selection.embroiderySize)}\nКоличество цветов: ${labelOf(threadColorSurchargeOptions, selection.threadColors)}\nУпаковка: ${labelOf(packagingOptions, selection.packaging)?.toLowerCase()}\n\nПредварительная стоимость: ${formatPrice(total)}\n\nХочу отправить рисунок и уточнить детали заказа.`; }
