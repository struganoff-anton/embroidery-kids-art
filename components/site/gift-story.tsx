import Image from "next/image";

export function GiftStory() {
  return (
    <section id="gift-story" className="px-3 py-16 min-[360px]:px-4 sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-8 lg:grid-cols-12 lg:gap-x-14 lg:gap-y-10">
        <header className="order-1 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:self-end">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">ПОДАРОК С ИСТОРИЕЙ</p>
          <h2 className="mt-3 max-w-2xl text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.06] tracking-[-0.04em]">
            Подарок, который невозможно купить готовым
          </h2>
        </header>

        <figure className="order-2 overflow-hidden rounded-card border border-line bg-surface lg:col-span-7 lg:col-start-1 lg:row-span-4 lg:row-start-1">
          <Image
            src="/images/gift/gift-for-dad.jpeg"
            alt="Мужчина в сером худи с вышитым детским рисунком семьи"
            width={960}
            height={1280}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="h-auto w-full"
          />
        </figure>

        <p className="order-3 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8 lg:col-span-5 lg:col-start-8 lg:row-start-2">
          Детский рисунок может стать подарком для мамы, папы, бабушки или дедушки — или любимой вещью самого автора.
        </p>

        <div className="order-4 border-t border-line pt-5 lg:col-span-5 lg:col-start-8 lg:row-start-3">
          <h3 className="text-xl font-semibold leading-snug">Для близких</h3>
          <p className="mt-2 max-w-lg text-sm leading-6 text-muted sm:text-base sm:leading-7">
            Первый портрет семьи, смешная подпись или рисунок, смысл которого понятен только вам.
          </p>
        </div>

        <div className="contents lg:order-5 lg:col-span-5 lg:col-start-8 lg:row-start-4 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-6">
          <div className="order-5 border-t border-line pt-5 lg:order-2 lg:pb-1">
            <h3 className="text-xl font-semibold leading-snug">Для самого ребёнка</h3>
            <p className="mt-2 text-sm leading-6 text-muted sm:text-base sm:leading-7">
              Собственный рисунок на настоящем худи или футболке — почти как свой маленький бренд.
            </p>
          </div>
          <figure className="order-6 overflow-hidden rounded-card border border-line bg-surface lg:order-1">
            <Image
              src="/images/gift/gift-for-child.png"
              alt="Ребёнок в жёлтой футболке с вышитым рисунком семьи"
              width={1086}
              height={1448}
              sizes="(min-width: 1024px) 18vw, 100vw"
              className="h-auto w-full"
            />
          </figure>
        </div>

        <blockquote className="order-7 mt-6 border-t border-accent pt-7 sm:mt-10 sm:pt-9 lg:order-6 lg:col-span-11 lg:col-start-2 lg:row-start-5 lg:mt-12">
          <p className="max-w-5xl text-[clamp(1.75rem,4.5vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.035em]">
            Один рисунок. Одна вещь. Второй такой просто не существует.
          </p>
        </blockquote>
      </div>
    </section>
  );
}
