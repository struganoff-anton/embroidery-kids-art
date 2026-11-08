const navigation = [
  ["Как это работает", "#how-it-works"],
  ["Примеры", "#examples"],
  ["Изделия", "#products"],
  ["Вопросы", "#faq"],
] as const;

const linkClass = "rounded-small px-2 py-2 text-sm font-medium text-muted hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary";

export function SiteHeader() {
  return (
    <header data-site-header className="sticky top-0 z-50 border-b border-line bg-background">
      <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-1.5 px-2.5 min-[360px]:gap-2 min-[360px]:px-4 sm:min-h-16 sm:px-6">
        <a href="#top" className="shrink-0 rounded-small text-base font-bold uppercase tracking-[0.16em] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-secondary" aria-label="Линии — на главную">
          Линии
        </a>
        <nav className="hidden items-center gap-3 md:flex" aria-label="Основная навигация">
          {navigation.map(([label, href]) => <a key={href} href={href} className={linkClass}>{label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#calculator" className="flex min-h-10 items-center justify-center rounded-button bg-accent px-2.5 text-xs font-semibold text-white hover:bg-accent-hover active:bg-accent-pressed focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary min-[380px]:px-3.5 min-[380px]:text-sm sm:min-h-11 sm:px-5">
            Создать изделие
          </a>
          <details className="relative md:hidden">
            <summary className="flex min-h-10 cursor-pointer list-none items-center rounded-button border border-line bg-surface px-2.5 text-xs font-semibold hover:bg-accent-light focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary min-[380px]:px-3 min-[380px]:text-sm sm:min-h-11 [&::-webkit-details-marker]:hidden">
              Меню
            </summary>
            <nav className="absolute right-0 top-13 z-50 grid w-52 gap-1 rounded-card border border-line bg-surface p-2 shadow-surface" aria-label="Мобильная навигация">
              {navigation.map(([label, href]) => <a key={href} href={href} className={linkClass}>{label}</a>)}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
