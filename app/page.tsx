import { Calculator } from "@/components/calculator/calculator";
import { FaqSection } from "@/components/site/faq-section";
import { FinalCta } from "@/components/site/final-cta";
import { GiftStory } from "@/components/site/gift-story";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { ProductValues } from "@/components/site/product-values";
import { SiteHeader } from "@/components/site/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen overflow-hidden bg-background text-foreground">
        <Hero />
        <HowItWorks />
        <section id="calculator" className="scroll-mt-20 px-2.5 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-12 min-[360px]:px-4 sm:px-6 sm:pb-20 sm:pt-20">
          <header className="mx-auto mb-6 max-w-6xl sm:mb-9">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Ваше изделие</p>
            <h2 className="mt-3 text-[clamp(1.75rem,7vw,3.5rem)] font-semibold leading-tight tracking-tight">Рассчитайте стоимость</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-lg sm:leading-8">Выберите изделие и параметры вышивки. Рисунок вы отправите после расчёта в Telegram или MAX.</p>
          </header>
          <Calculator />
        </section>
        <ProductValues />
        <GiftStory />
        <FaqSection />
        <FinalCta />
      </main>
    </>
  );
}
