'use client'

import Link from 'next/link'
import { SITE } from '@/content/site'
import { useConsent } from '@/lib/consent'

/** Баннер при первом входе. Не перекрывает страницу целиком и не держит фокус: это выбор, а не стена. */
export function CookieBanner() {
  // Если хранилище недоступно, выбор держится в памяти страницы (src/lib/consent.ts) и тоже скрывает баннер.
  const [consent, save] = useConsent()
  if (consent !== null) return null

  const choose = (v: 'all' | 'necessary') => save(v)

  return (
    <section
      role="region"
      aria-label="Файлы cookie"
      data-testid="cookie-banner"
      className="fixed inset-x-2 bottom-2 z-[60] rounded-3xl border border-line bg-surface p-4 text-fg shadow-2xl motion-safe:animate-[cookie-in_400ms_var(--ease-out-soft)] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md sm:p-5"
    >
      <p className="text-sm leading-relaxed">
        Мы храним в браузере тему и ваш выбор, без них сайт не работает. {SITE.metrikaId ? 'Интерактивная карта Яндекса и Яндекс Метрика ставят свои cookie, поэтому мы загружаем их только с вашего согласия.' : 'Интерактивная карта Яндекса ставит свои cookie, поэтому мы загружаем её только с вашего согласия.'}{' '}
        <Link href="/cookies" className="link whitespace-nowrap">
          Подробнее о cookie
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary min-h-11 grow px-3 text-sm tracking-normal whitespace-nowrap normal-case" onClick={() => choose('all')}>
          Принять все
        </button>
        <button type="button" className="btn btn-ghost min-h-11 grow px-3 text-sm tracking-normal whitespace-nowrap normal-case" onClick={() => choose('necessary')}>
          Только необходимые
        </button>
      </div>
    </section>
  )
}
