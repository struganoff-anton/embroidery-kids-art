const drawingBenefits = [
  {
    title: "Сохраняем характер рисунка",
    text: "Не выравниваем линии и не перерисовываем изображение «красивее». В вышивке остаётся почерк ребёнка.",
  },
  {
    title: "Сначала показываем результат",
    text: "Перед вышивкой мы вручную подготавливаем рисунок в специальной программе и согласовываем с вами макет.",
  },
  {
    title: "Сделано надолго",
    text: "Вышивка становится частью изделия: она объёмная, хорошо переносит носку и стирки и не выглядит как обычный принт.",
  },
] as const;

const garmentBenefits = [
  {
    title: "Плотные материалы",
    text: "Подбираем ткани, на которых вышивка выглядит аккуратно и держит форму.",
  },
  {
    title: "Детские и взрослые модели",
    text: "Можно вышить рисунок на вещи для самого ребёнка — или сделать худи, футболку или свитшот для мамы, папы и других близких.",
  },
  {
    title: "Standard и Premium",
    text: "Можно выбрать более доступный вариант или более плотный материал Premium. Качество самой вышивки при этом одинаковое.",
  },
] as const;

export function ProductValues() {
  return (
    <>
      <section id="preserving-drawing" className="px-3 py-16 min-[360px]:px-4 sm:px-6 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-end lg:gap-16">
            <h2 className="max-w-3xl text-[clamp(2rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
              Сохраняем рисунок таким, каким его нарисовал ребёнок
            </h2>
            <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Неровные линии, смешные пропорции, подписи и маленькие детали — именно они делают детский рисунок настоящим. Мы не «улучшаем» его, а бережно переносим в вышивку.
            </p>
          </div>

          <ol className="mt-12 grid gap-8 sm:mt-16 sm:grid-cols-3 sm:gap-6 lg:gap-10">
            {drawingBenefits.map(({ title, text }, index) => (
              <li key={title} className="border-t border-line pt-4 sm:pt-5">
                <span className="text-xs font-semibold tracking-[0.14em] text-accent-secondary">0{index + 1}</span>
                <h3 className="mt-5 text-lg font-semibold leading-snug sm:text-xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted sm:text-base sm:leading-7">{text}</p>
              </li>
            ))}
          </ol>

          <blockquote className="mt-14 border-t border-accent pt-6 sm:mt-20 sm:pt-8">
            <p className="max-w-4xl text-[clamp(1.5rem,4vw,2.75rem)] font-medium leading-tight tracking-[-0.025em]">
              Через несколько лет рисунок останется таким же. А ребёнок — уже нет.
            </p>
          </blockquote>
        </div>
      </section>

      <section id="clothing-quality" className="border-y border-line bg-surface px-3 py-16 min-[360px]:px-4 sm:px-6 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Качество изделия</p>
            <h2 className="mt-3 max-w-xl text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.035em]">
              Не просто основа для вышивки
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Мы хотели, чтобы ценность была не только в рисунке. Поэтому используем плотные футболки, свитшоты и худи собственного производства — вещи, которые хорошо сидят и рассчитаны на обычную ежедневную носку.
            </p>
          </header>

          <ol className="border-t border-line">
            {garmentBenefits.map(({ title, text }, index) => (
              <li key={title} className="grid gap-3 border-b border-line py-6 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5 sm:py-7">
                <span className="text-sm font-semibold text-accent-secondary">0{index + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold leading-snug sm:text-xl">
                    {index === 2 ? <><span className="whitespace-nowrap">Standard</span> и <span className="whitespace-nowrap">Premium</span></> : title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted sm:text-base sm:leading-7">
                    {index === 2 ? <>Можно выбрать более доступный вариант или более плотный материал <span className="whitespace-nowrap">Premium</span>. Качество самой вышивки при этом одинаковое.</> : text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
