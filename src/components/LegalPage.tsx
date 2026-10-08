import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { LegalDoc } from '@/content/legal'
import { SITE } from '@/content/site'
import { ThemeToggle } from './ThemeToggle'
import { Logo } from './ui/Logo'

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div className="min-h-dvh px-2 pt-2 pb-6 sm:px-4 sm:pt-4 md:px-6">
      <header className="mx-auto flex max-w-[94rem] items-center gap-2 rounded-full border border-line bg-surface py-1.5 pr-1.5 pl-3 shadow-xl sm:pl-5">
        <Link href="/" className="mr-auto inline-flex min-h-11 items-center" aria-label={`${SITE.brandFull}, на главную`}>
          <Logo />
        </Link>
        <ThemeToggle className="border border-line hover:bg-subtle" />
        <Link href="/" className="btn btn-ghost">
          <ArrowLeft aria-hidden className="size-4" />
          На главную
        </Link>
      </header>
      <main className="shell max-w-3xl py-14">
        <p className="label text-accent">
          Версия {SITE.legalVersion.version} от {SITE.legalVersion.date}
        </p>
        <h1 className="display mt-4 text-3xl leading-tight font-normal sm:text-4xl">{doc.title}</h1>
        {SITE.contentMode === 'concept' && (
          <p className="mt-6 rounded-2xl bg-accent-soft p-4 text-fg">Это шаблон концепт-проекта. Для настоящего сайта текст готовит юрист компании-оператора.</p>
        )}
        <div className="mt-10 grid gap-4">
          {doc.sections.map((s) => (
            <section key={s.heading} className="card p-6">
              <h2 className="text-xl font-semibold">{s.heading}</h2>
              <div className="mt-3 grid gap-3 text-muted">
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <footer className="shell max-w-3xl border-t border-line py-8">
        <p className="text-sm text-muted">{SITE.disclaimer}</p>
      </footer>
    </div>
  )
}
