import { Calculator } from "@/components/calculator/calculator";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 px-2.5 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-5 text-stone-900 min-[360px]:px-4 sm:px-6 sm:pb-16 sm:pt-16">
      <header className="mx-auto mb-5 max-w-6xl sm:mb-10">
        <h1 className="max-w-3xl text-[clamp(1.5rem,7vw,3rem)] font-semibold leading-[1.12] tracking-tight sm:text-5xl">
          Создайте изделие с рисунком ребёнка
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 sm:mt-4 sm:text-lg">
          Выберите параметры и узнайте предварительную стоимость.
        </p>
      </header>
      <Calculator />
    </main>
  );
}
