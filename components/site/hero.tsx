import Image from "next/image";

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
      <VisualCard title="Оригинальный рисунок" className="lg:col-span-5 lg:mt-10" label="Оригинальный детский рисунок семьи и дома">
        <Image
          src="/images/original-drawing-v2.jpg"
          alt="Оригинальный детский рисунок семьи, дома и облаков"
          width={1433}
          height={1011}
          sizes="(min-width: 1024px) 20vw, 50vw"
          className="h-full w-full object-cover object-[50%_44%]"
        />
      </VisualCard>
      <VisualCard title="Отрисовка макета в программе" className="lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:ml-6 lg:w-[calc(100%-1.5rem)]" label="Подготовка макета рисунка для вышивки">
        <Image
          src="/images/stitch-preview.jpg"
          alt="Подготовка детского рисунка к машинной вышивке на планшете"
          width={1920}
          height={2560}
          sizes="(min-width: 1024px) 20vw, 50vw"
          className="h-full w-full object-cover object-center"
        />
      </VisualCard>
      <VisualCard dominant title="Готовая вышивка" className="col-span-2 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1" label="Готовое худи с вышивкой детского рисунка">
        <Image
          src="/images/hero-girl-hoodie.jpg"
          alt="Девочка в худи с вышивкой детского рисунка"
          width={1023}
          height={1537}
          priority
          sizes="(min-width: 1024px) 38vw, 100vw"
          className="h-full w-full object-cover object-[50%_44%]"
        />
      </VisualCard>
      <div className="hidden items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted lg:col-span-5 lg:col-start-1 lg:flex" aria-hidden="true"><span>рисунок</span><span className="h-px flex-1 bg-line" /><span>вещь</span></div>
    </div>
  );
}

function VisualCard({ title, label, className, dominant = false, children }: { title: string; label: string; className?: string; dominant?: boolean; children: React.ReactNode }) {
  return (
    <figure className={`${className ?? ""} overflow-hidden border border-line bg-surface ${dominant ? "min-h-56 shadow-surface lg:min-h-72" : "min-h-36 lg:min-h-52"}`} aria-label={label}>
      <div className={`flex items-center justify-center text-muted ${dominant ? "aspect-[4/5] w-full p-0" : "h-28 p-3 sm:h-36 sm:p-5 lg:h-44"}`}>{children}</div>
      <figcaption className="border-t border-line px-3 py-2.5 text-xs font-semibold sm:px-4 sm:py-3 sm:text-sm">{title}</figcaption>
    </figure>
  );
}
