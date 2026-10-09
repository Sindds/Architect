'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useRef } from 'react'

/**
 * Состав пакета. На телефоне свёрнут, чтобы три пакета не тянулись на три экрана;
 * на широком экране раскрыт сразу, там пакеты стоят рядом и их сравнивают по составу.
 */
export function PackageDetails({ summaryClassName, children }: { summaryClassName: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    if (ref.current && matchMedia('(min-width: 64rem)').matches) ref.current.open = true
  }, [])
  return (
    <details ref={ref} className="group mb-4 sm:mb-6">
      <summary className={summaryClassName}>
        Что входит и что нет
        <ChevronDown aria-hidden className="size-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
      </summary>
      {children}
    </details>
  )
}
