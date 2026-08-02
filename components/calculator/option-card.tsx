import type { ReactNode } from "react";

interface OptionCardProps {
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  visual?: ReactNode;
  selected: boolean;
  onSelect: () => void;
}

export function OptionCard({ title, description, meta, visual, selected, onSelect }: OptionCardProps) {
  return (
    <button type="button" aria-pressed={selected} onClick={onSelect}
      className={`flex min-h-28 w-full flex-col items-start gap-2.5 rounded-2xl border p-3.5 text-left transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-stone-900 sm:min-h-32 sm:gap-3 sm:p-4 ${selected ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 bg-white text-stone-900 hover:border-stone-400 hover:bg-stone-50"}`}>
      {visual}
      <span className="text-lg font-semibold leading-tight">{title}</span>
      {description ? <span className={`text-sm leading-5 ${selected ? "text-stone-200" : "text-stone-500"}`}>{description}</span> : null}
      {meta ? <span className="mt-auto text-sm font-semibold">{meta}</span> : null}
    </button>
  );
}
