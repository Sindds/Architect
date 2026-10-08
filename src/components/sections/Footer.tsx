import Link from 'next/link'
import { SITE } from '@/content/site'
import { OfficeMap } from '../OfficeMap'
import { Logo } from '../ui/Logo'

/** Футер по образцу: тёмная скруглённая карточка с контактами, дисклеймером концепта и юридическими ссылками. */
export function Footer() {
  const concept = SITE.contentMode === 'concept'
  return (
    <footer className="mx-auto w-full max-w-[100rem] px-2 pt-4 pb-6 sm:px-4 md:px-6">
      <div className="on-dark rounded-[24px] border border-white/10 bg-inverse p-6 text-on-inverse sm:rounded-[36px] sm:p-10 lg:p-14">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-4 max-w-sm text-on-inverse-muted">{SITE.descriptor}. Проектируем и строим дома из клееного бруса и монолита в Подмосковье.</p>
          </div>
          <nav aria-label="Разделы страницы (футер)" className="lg:col-span-3">
            <p className="label text-[#9fc0de]">Разделы</p>
            <ul className="mt-3 grid">
              {SITE.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="link inline-flex min-h-11 items-center">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="lg:col-span-4">
            <p className="label text-[#9fc0de]">Контакты</p>
            <ul className="mt-3 grid">
              <li>
                <a href={SITE.phoneHref} className="link num inline-flex min-h-11 items-center text-lg font-semibold">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="link inline-flex min-h-11 items-center">
                  {SITE.email}
                </a>
              </li>
              <li className="py-2 text-on-inverse-muted">{SITE.address}</li>
              <li className="text-on-inverse-muted">{SITE.hours}</li>
            </ul>
          </div>
        </div>
        <div className="grid gap-6 border-b border-white/10 py-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-[#9fc0de]">Как добраться</p>
            <p className="mt-3 max-w-sm text-on-inverse-muted">
              {SITE.address}. {concept ? 'Адрес условный, как и вся компания концепт-проекта: карта показывает район.' : SITE.hours}
            </p>
          </div>
          <div className="lg:col-span-8">
            <OfficeMap />
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-xl text-sm text-on-inverse-muted" data-testid="disclaimer">
            {concept ? SITE.disclaimer : SITE.brandFull}
          </p>
          <ul className="flex flex-wrap gap-x-5 text-sm">
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
      </div>
    </footer>
  )
}
