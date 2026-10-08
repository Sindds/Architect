import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { LegalDoc } from '@/content/legal'
import { SITE } from '@/content/site'
import { Logo } from './ui/Logo'

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-line">
        <div className="shell flex h-20 items-center justify-between">
          <Link href="/" className="inline-flex min-h-11 items-center" aria-label={`${SITE.brandFull} — на главную`}>
            <Logo />
          </Link>
          <Link href="/" className="link inline-flex min-h-11 items-center gap-2">
            <ArrowLeft aria-hidden className="size-4" />
            На главную
          </Link>
        </div>
      </header>
      <main className="shell max-w-3xl py-14">
        <p className="label text-accent">
          Версия {SITE.legalVersion.version} от {SITE.legalVersion.date}
        </p>
        <h1 className="mt-4 font-display text-h2 font-medium">{doc.title}</h1>
        {SITE.contentMode === 'concept' && (
          <p className="mt-6 border-l-2 border-accent pl-4 text-ink-2">
            Шаблон концепт-проекта. На реальном сайте текст готовит юрист компании-оператора.
          </p>
        )}
        <div className="mt-10 grid gap-8">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold">{s.heading}</h2>
              <div className="mt-3 grid gap-3 text-ink-2">
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <footer className="border-t border-line py-8">
        <p className="shell text-sm text-ink-2">{SITE.disclaimer}</p>
      </footer>
    </div>
  )
}
