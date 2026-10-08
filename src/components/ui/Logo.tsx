/** Знак по образцу: квадрат со скруглением, внутри арка над линией земли; рядом название прописными. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-current/35">
        <svg aria-hidden viewBox="0 0 32 32" className="size-6" fill="none" strokeWidth="2.2" stroke="currentColor">
          <path d="M7 24V16a9 9 0 0 1 18 0v8" />
          <path d="M4 24h24" />
          <path d="M12 24v-6a4 4 0 0 1 8 0v6" stroke="#7ea2c4" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="display text-sm font-bold tracking-[0.16em] whitespace-nowrap">
          ARCLINE<span className="hidden min-[440px]:inline"> ESTATE</span>
        </span>
        <span className="label mt-1 hidden text-xs tracking-[0.16em] opacity-80 min-[440px]:block">архитектура и стройка</span>
      </span>
    </span>
  )
}
