const steps = [
  ["Вы выбираете изделие", "Подбираете модель, размер и детали вышивки."],
  ["Отправляете рисунок в мессенджере", "После расчёта переходите в Telegram или MAX."],
  ["Согласовываете макет", "После подтверждения мы запускаем вышивку."],
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-line bg-surface px-3 py-10 min-[360px]:px-4 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-12">
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Три простых шага</p><h2 className="mt-3 max-w-md text-[clamp(1.75rem,5vw,3rem)] font-semibold leading-tight tracking-tight">От рисунка до любимой вещи</h2></div>
          <ol className="grid gap-6 sm:grid-cols-3 sm:gap-7 lg:gap-9">
            {steps.map(([title, copy], index) => <li key={title} className="border-t border-line pt-4"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-accent-secondary">0{index + 1}</span><StepIcon index={index} /></div><h3 className="mt-3 font-semibold leading-snug">{title}</h3><p className="mt-2 text-sm leading-6 text-muted">{copy}</p></li>)}
          </ol>
        </div>
        <span id="examples" className="scroll-mt-20" aria-hidden="true" /><span id="products" className="scroll-mt-20" aria-hidden="true" /><span id="faq" className="scroll-mt-20" aria-hidden="true" />
      </div>
    </section>
  );
}

function StepIcon({ index }: { index: number }) {
  const paths = [
    <path key="shirt" d="m8 7-4 2-2 4 3 2 1-2v7h12v-7l1 2 3-2-2-4-4-2-2 2h-4z" />,
    <path key="message" d="M4 5h16v11H9l-5 4V5Zm4 4h8m-8 3h5" />,
    <path key="check" d="m4 13 5 5L20 6M7 5h7" />,
  ];
  return <svg viewBox="0 0 24 24" className="h-6 w-6 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[index]}</svg>;
}
