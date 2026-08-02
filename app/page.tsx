import { Calculator } from "@/components/calculator/calculator";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background px-2.5 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-5 text-foreground min-[360px]:px-4 sm:px-6 sm:pb-16 sm:pt-14">
      <header className="relative mx-auto mb-5 max-w-7xl sm:mb-9">
        <span aria-hidden="true" className="absolute -right-1 -top-2 hidden rotate-12 text-2xl font-medium text-accent sm:block">✦</span>
        <h1 className="max-w-3xl text-[clamp(1.5rem,7vw,3rem)] font-semibold leading-[1.12] tracking-tight sm:text-5xl">
          Создайте изделие с рисунком ребёнка
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:mt-4 sm:text-lg">
          Выберите параметры и узнайте предварительную стоимость.
        </p>
        <span aria-hidden="true" className="mt-3 block h-0.5 w-12 -rotate-2 rounded-full bg-accent-secondary sm:w-16" />
      </header>
      <Calculator />
    </main>
  );
}
