import { FileText } from 'lucide-react'
import { SITE } from '@/content/site'
import { SectionHead } from '../ui/SectionHead'

const DOCS = [
  {
    href: SITE.docs.contract,
    title: 'Образец договора генподряда',
    about: 'Фиксированная цена, график оплаты по этапам, порядок допсоглашений, гарантийные сроки, ответственность сторон.',
  },
  {
    href: SITE.docs.estimate,
    title: 'Образец сметы',
    about: 'Разбивка по этапам и разделам: фундамент, каркас, кровля, остекление, инженерия, отделка. Что входит и что нет.',
  },
]

export function Documents() {
  return (
    <section id="documents" aria-labelledby="docs-title" className="border-t border-line bg-sheet py-16 lg:py-24">
      <div className="shell">
        <SectionHead
          id="docs-title"
          index="09"
          label="Документы"
          title="Прочитайте договор до первой встречи"
          lead="Образцы — те же документы, что вы подпишете. Отличаются только ваши данные и проект."
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {DOCS.map((d) => (
            <li key={d.href}>
              <a
                href={d.href}
                target="_blank"
                rel="noopener"
                className="group flex h-full gap-5 border border-ink-3/60 bg-paper p-6 transition-colors hover:border-ink"
              >
                <span className="relative flex h-24 w-[4.5rem] shrink-0 flex-col justify-between border border-ink bg-sheet p-2 shadow-[4px_4px_0_var(--color-line)] transition-transform group-hover:-translate-y-1 motion-reduce:transition-none">
                  <FileText aria-hidden className="size-5 text-accent" strokeWidth={1.5} />
                  <span className="label text-xs">PDF</span>
                </span>
                <span>
                  <span className="block font-display text-[1.75rem] font-medium leading-tight group-hover:underline">{d.title}</span>
                  <span className="mt-2 block text-ink-2">{d.about}</span>
                  <span className="label mt-3 block text-accent">Открыть PDF</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        {SITE.contentMode === 'concept' && (
          <p className="mt-6 text-sm text-ink-2">В концепт-проекте документы — демонстрационные образцы с пометкой «ОБРАЗЕЦ».</p>
        )}
      </div>
    </section>
  )
}
