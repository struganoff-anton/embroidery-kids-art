export function ProgressBar({ step, total }: { step: number; total: number }) {
  const progress = Math.round((step / total) * 100);
  return (
    <div aria-label={`Шаг ${step} из ${total}`}>
      <div className="mb-2.5 flex items-baseline justify-between"><span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Шаг {step} из {total}</span><span className="text-xs font-medium text-muted">{progress}%</span></div>
      <div className="h-1 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} /></div>
    </div>
  );
}
