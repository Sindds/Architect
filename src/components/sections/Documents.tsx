import { ArrowUpRight, FileText } from 'lucide-react'
import { COPY } from '@/content/copy'
import { SITE } from '@/content/site'
import { SectionHead } from '../ui/SectionHead'

const DOCS = [
  {
    href: SITE.docs.contract,
    title: 'Образец договора генподряда',
    about: 'Цена, график платежей по этапам, порядок допсоглашений, гарантия и ответственность сторон.',
  },
  {
    href: SITE.docs.estimate,
    title: 'Образец сметы',
    about: 'Разбивка по этапам и разделам: фундамент, каркас, кровля, остекление, инженерия, отделка. Отдельно указано, что в цену не входит.',
  },
]

export function Documents() {
  return (
    <section id="documents" aria-labelledby="docs-title" className="border-t border-line">
      <div className="shell py-16 sm:py-24">
        <SectionHead id="docs-title" index={9} copy={COPY.sections.documents} />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-14">
          {DOCS.map((d) => (
            <li key={d.href}>
              <a href={d.href} target="_blank" rel="noopener" className="card card-hover group flex h-full gap-5 p-6 sm:p-8">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                  <FileText aria-hidden className="size-6" strokeWidth={1.5} />
                </span>
                <span className="flex-1">
                  <span className="block text-xl font-semibold group-hover:underline">{d.title}</span>
                  <span className="mt-2 block text-muted">{d.about}</span>
                  <span className="label mt-4 inline-flex items-center gap-1.5 text-accent">
                    Открыть PDF <ArrowUpRight aria-hidden className="size-3.5" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        {SITE.contentMode === 'concept' && <p className="mt-5 text-sm text-muted">В концепт-проекте это демонстрационные образцы с пометкой «ОБРАЗЕЦ».</p>}
      </div>
    </section>
  )
}
