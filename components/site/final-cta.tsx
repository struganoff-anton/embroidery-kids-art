export function FinalCta() {
  return (
    <section className="bg-foreground px-3 py-16 text-white min-[360px]:px-4 sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <span className="block h-0.5 w-16 bg-accent-secondary" aria-hidden="true" />
        <h2 className="mt-7 max-w-5xl text-[clamp(2.25rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
          Есть рисунок, который хочется сохранить?
        </h2>
        <div className="mt-8 grid gap-7 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-14">
          <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            Выберите изделие и рассчитайте предварительную стоимость. Сам рисунок отправите нам после оформления заказа.
          </p>
          <a
            href="#calculator"
            className="flex min-h-12 w-full items-center justify-center rounded-button bg-accent px-7 font-semibold text-white hover:bg-accent-hover active:bg-accent-pressed focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-secondary sm:w-fit"
          >
            Создать изделие
          </a>
        </div>
      </div>
    </section>
  );
}
