import { SITE } from '@/content/site'

/** Знак: дуга-арка над линией земли — «arc» + «line». */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg aria-hidden viewBox="0 0 32 32" className="size-8 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 25V16a11 11 0 0 1 22 0v9" />
        <path d="M2 25h28" />
        <path d="M11 25v-7a5 5 0 0 1 10 0v7" className="text-accent" stroke="currentColor" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[1.0625rem] font-semibold tracking-[0.18em]">{SITE.brand}</span>
        <span className="label mt-1 hidden text-xs tracking-[0.1em] text-ink-2 min-[400px]:block">архитектура · стройка</span>
      </span>
    </span>
  )
}
