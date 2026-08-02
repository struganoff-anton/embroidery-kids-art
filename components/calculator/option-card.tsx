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
      className={`relative flex min-h-28 w-full flex-col items-start gap-2.5 rounded-card border p-3.5 text-left transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-secondary sm:min-h-32 sm:gap-3 sm:p-4 ${selected ? "border-accent bg-accent-light text-foreground" : "border-line bg-surface text-foreground hover:border-muted hover:bg-[#fcfbf8]"}`}>
      {selected ? <span aria-hidden="true" className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">✓</span> : null}
      {visual}
      <span className="text-lg font-semibold leading-tight">{title}</span>
      {description ? <span className="text-sm leading-5 text-muted">{description}</span> : null}
      {meta ? <span className="mt-auto text-sm font-semibold">{meta}</span> : null}
    </button>
  );
}
