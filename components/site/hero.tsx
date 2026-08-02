export function Hero() {
  return (
    <section id="top" className="scroll-mt-20 px-3 pb-12 pt-7 min-[360px]:px-4 sm:px-6 sm:pb-20 sm:pt-14">
      <div className="mx-auto grid max-w-7xl items-center gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:grid-rows-[auto_auto] lg:gap-x-14 lg:gap-y-7">
        <div className="order-1 lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Вышивка по детским рисункам</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2rem,9vw,5.25rem)] font-semibold leading-[1.01] tracking-[-0.045em] lg:mt-4 lg:leading-[0.98]">
            Рисунки, которые хочется сохранить
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted min-[380px]:text-base min-[380px]:leading-7 sm:text-lg sm:leading-8">
            Бережно переносим детские рисунки в вышивку на футболках, свитшотах и худи, сохраняя характер каждой линии.
          </p>
        </div>
        <div className="order-3 lg:col-start-1 lg:row-start-2 lg:self-start">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:gap-4">
            <a href="#calculator" className="flex min-h-12 w-full items-center justify-center rounded-button bg-accent px-6 font-semibold text-white hover:bg-accent-hover active:bg-accent-pressed focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-secondary sm:w-auto">
              Создать своё изделие
            </a>
            <a href="#how-it-works" className="rounded-small py-2 font-semibold text-foreground underline decoration-accent-secondary decoration-2 underline-offset-4 hover:text-accent-secondary focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-secondary">
              Посмотреть, как это работает
            </a>
          </div>
          <p className="mt-4 max-w-lg text-xs leading-5 text-muted sm:mt-5 sm:text-sm">Макет перед вышивкой согласуем с вами · Изготовление от 3–4 рабочих дней</p>
        </div>
        <div className="order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1"><HeroComposition /></div>
      </div>
    </section>
  );
}

function HeroComposition() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-4" aria-label="Путь от рисунка до готовой вышивки">
      <VisualCard title="Оригинальный рисунок" className="lg:col-span-5 lg:mt-10" label="Нейтральный заполнитель для оригинального детского рисунка">
        <svg viewBox="0 0 240 150" className="h-full w-full" aria-hidden="true">
          <path d="M42 111c18-37 35-63 69-72 24 16 49 33 82 74M67 84l15-13 16 13 20-20 20 19" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="166" cy="45" r="13" fill="none" stroke="#3155D9" strokeWidth="3" />
          <path d="M166 22v-8m0 62v-8m-23-23h-8m62 0h-8" stroke="#3155D9" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </VisualCard>
      <VisualCard title="Макет со стежками" className="lg:col-span-5 lg:col-start-2" label="Нейтральный заполнитель для макета машинной вышивки">
        <svg viewBox="0 0 240 150" className="h-full w-full" aria-hidden="true">
          <path d="M38 108c28-53 57-75 85-70 27 5 48 36 78 74" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 5" strokeLinecap="round" />
          <path d="M78 94l29-31 25 28 21-20 22 26" fill="none" stroke="#3155D9" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      </VisualCard>
      <VisualCard dominant title="Готовая вышивка" className="col-span-2 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1" label="Нейтральный заполнитель для готового изделия с вышивкой">
        <svg viewBox="0 0 320 260" className="h-full w-full" aria-hidden="true">
          <path d="M102 50 63 72 34 123l37 23 16-25v104h146V121l16 25 37-23-29-51-39-22-23 24h-70z" fill="#eeebe5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M128 137c13-23 28-35 44-34 16 2 29 16 42 38" fill="none" stroke="#F05A47" strokeWidth="4" strokeLinecap="round" />
          <path d="m151 137 18-19 19 20" fill="none" stroke="#3155D9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </VisualCard>
      <div className="hidden items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted lg:col-span-5 lg:col-start-1 lg:flex" aria-hidden="true"><span>рисунок</span><span className="h-px flex-1 bg-line" /><span>вещь</span></div>
    </div>
  );
}

function VisualCard({ title, label, className, dominant = false, children }: { title: string; label: string; className?: string; dominant?: boolean; children: React.ReactNode }) {
  return (
    <figure className={`${className ?? ""} overflow-hidden border border-line bg-surface ${dominant ? "min-h-56 shadow-surface lg:min-h-72" : "min-h-36 lg:min-h-52"}`} aria-label={label}>
      <div className={`flex items-center justify-center p-3 text-muted sm:p-5 ${dominant ? "h-48 sm:h-64 lg:h-80" : "h-28 sm:h-36 lg:h-44"}`}>{children}</div>
      <figcaption className="border-t border-line px-3 py-2.5 text-xs font-semibold sm:px-4 sm:py-3 sm:text-sm">{title}</figcaption>
    </figure>
  );
}
