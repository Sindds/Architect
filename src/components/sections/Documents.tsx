import { ArrowUpRight, FileText } from 'lucide-react'
import { COPY } from '@/content/copy'
import { ESTIMATE_SAMPLE } from '@/content/estimate-sample'
import { SITE } from '@/content/site'
import { formatRub, plural } from '@/lib/format'
import { estimateFor } from '@/lib/pricing'
import { SectionHead } from '../ui/SectionHead'

const sheet = estimateFor(ESTIMATE_SAMPLE)
const lines = sheet.sections.reduce((n, s) => n + s.lines.length, 0)

const DOCS = [
  {
    href: SITE.docs.contract,
    title: 'Образец договора строительного подряда',
    about: 'Твёрдая цена, оплата после акта по каждому этапу, гарантия 10 лет на фундамент и каркас, неустойка по закону о защите прав потребителей, порядок допсоглашений и расторжения.',
  },
  {
    href: SITE.docs.estimate,
    title: `Образец сметы ${ESTIMATE_SAMPLE.name} на ${formatRub(sheet.total)}`,
    about: `${lines} ${plural(lines, ['позиция', 'позиции', 'позиций'])} в ${sheet.sections.length} разделах: объёмы, цены за единицу и суммы от геологии до светильников. Отдельно показаны график платежей и то, что в цену не входит.`,
  },
]

export function Documents() {
  return (
    <section id="documents" aria-labelledby="docs-title" className="border-t border-line">
      <div className="shell py-16 sm:py-24">
        <SectionHead id="docs-title" copy={COPY.sections.documents} />
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
