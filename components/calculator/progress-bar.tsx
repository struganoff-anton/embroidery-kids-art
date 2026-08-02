export function ProgressBar({ step, total }: { step: number; total: number }) {
  const progress = Math.round((step / total) * 100);
  return (
    <div aria-label={`Шаг ${step} из ${total}`}>
      <div className="mb-2 flex justify-between text-sm text-stone-500"><span>Шаг {step} из {total}</span><span>{progress}%</span></div>
      <div className="h-1.5 overflow-hidden rounded-full bg-stone-200"><div className="h-full rounded-full bg-stone-900" style={{ width: `${progress}%` }} /></div>
    </div>
  );
}
