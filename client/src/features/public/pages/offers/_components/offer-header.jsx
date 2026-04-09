export default function OfferHeader({
  badge,
  title,
  description,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
}) {
  const titleParts = title?.split(" ") || [];
  const firstLine = titleParts.slice(0, 3).join(" ");
  const secondLine = titleParts.slice(3).join(" ");

  return (
    <header className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-100 via-slate-100 to-white px-4 py-12 text-center shadow-xl shadow-slate-200/30 sm:px-8 sm:py-16 lg:px-12 dark:border-slate-700/70 dark:from-slate-900 dark:via-slate-900 dark:to-black dark:shadow-black/30">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-500/15" />
        <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-300/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl space-y-6 sm:space-y-8">
        <div className="inline-flex items-center justify-center rounded-xl border border-violet-300/70 bg-violet-200/60 px-3 py-1.5 text-xs font-semibold tracking-wide text-violet-700 uppercase sm:text-sm dark:border-violet-500/40 dark:bg-violet-500/20 dark:text-violet-200">
          {badge}
        </div>

        <h1 className="px-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
          <span className="block">{firstLine}</span>
          <span className="mt-1 block bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent sm:mt-3">
            {secondLine}
          </span>
        </h1>

        <p className="mx-auto max-w-3xl px-2 text-base leading-relaxed text-slate-600 sm:text-lg lg:text-2xl dark:text-slate-300">
          {description}
        </p>

        <div className="flex flex-col items-center justify-center gap-3 px-2 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="from-main to-main-dark hover:to-main flex h-12 min-w-40 items-center justify-center rounded-xl bg-gradient-to-r px-6 text-base font-semibold text-white shadow-lg shadow-indigo-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            {primaryActionLabel}
          </button>

          <button
            type="button"
            onClick={onSecondaryAction}
            className="flex h-12 min-w-40 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-base font-semibold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-400"
          >
            {secondaryActionLabel}
          </button>
        </div>
      </div>
    </header>
  );
}
