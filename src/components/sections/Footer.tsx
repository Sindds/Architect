import Link from 'next/link'
import { SITE } from '@/content/site'
import { Logo } from '../ui/Logo'

/** Футер в виде основной надписи чертежа (штампа): дисклеймер концепта или реквизиты. */
export function Footer() {
  const concept = SITE.contentMode === 'concept'
  return (
    <footer className="bg-paper py-10">
      <div className="shell">
        <div className="grid border border-ink text-[0.9375rem] md:grid-cols-12">
          <div className="border-b border-ink p-5 md:col-span-4 md:border-r md:border-b-0">
            <Logo />
            <p className="mt-3 text-ink-2">{SITE.descriptor}</p>
          </div>
          <div className="border-b border-ink p-5 md:col-span-5 md:border-r md:border-b-0">
            <p className="label text-ink-3">{concept ? 'Статус' : 'Реквизиты'}</p>
            <p className="mt-1 font-medium" data-testid="disclaimer">
              {SITE.disclaimer}
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-5">
              <li>
                <Link href="/privacy" className="link inline-flex min-h-11 items-center">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/soglasie" className="link inline-flex min-h-11 items-center">
                  Согласие на обработку данных
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="link inline-flex min-h-11 items-center">
                  Файлы cookie
                </Link>
              </li>
            </ul>
          </div>
          <dl className="label grid grid-cols-2 md:col-span-3">
            <div className="border-r border-b border-ink p-3">
              <dt className="text-ink-3">Стадия</dt>
              <dd className="mt-0.5 text-ink">{concept ? 'Концепт' : 'Рабочая'}</dd>
            </div>
            <div className="border-b border-ink p-3">
              <dt className="text-ink-3">Лист</dt>
              <dd className="num mt-0.5 text-ink">1 из 1</dd>
            </div>
            <div className="col-span-2 p-3">
              <dt className="text-ink-3">Контакты</dt>
              <dd className="mt-0.5 text-ink">
                <a href={SITE.phoneHref} className="link num inline-flex min-h-11 items-center">
                  {SITE.phoneDisplay}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </footer>
  )
}
