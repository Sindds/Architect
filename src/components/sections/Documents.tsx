import { ArrowUpRight, FileText } from 'lucide-react'
import { COPY } from '@/content/copy'
import { ESTIMATE_SAMPLE } from '@/content/estimate-sample'
import { SITE } from '@/content/site'
import { formatRub, plural } from '@/lib/format'
import { estimateFor } from '@/lib/pricing'
import { SectionHead } from '../ui/SectionHead'
import { revealOrder } from '@/lib/reveal'

const sheet = estimateFor(ESTIMATE_SAMPLE)
const lines = sheet.sections.reduce((n, s) => n + s.lines.length, 0)

const DOCS = [
  {
    href: SITE.docs.contract,
    title: 'Образец договора строительного подряда',
    about: 'Фиксированная цена, оплата после приёмки каждого этапа, гарантия 10 лет на фундамент и каркас. В договоре также прописаны неустойка в соответствии с законом о защите прав потребителей, порядок согласования изменений и условия расторжения договора.',
  },
  {
    href: SITE.docs.estimate,
    title: `Образец сметы ${ESTIMATE_SAMPLE.name} на ${formatRub(sheet.total)}`,
    about: `${lines} ${plural(lines, ['позиция', 'позиции', 'позиций'])} в ${sheet.sections.length} разделах: объёмы работ, цены за единицу и итоговые суммы — от геологических изысканий до светильников. Отдельно указаны график платежей и то, что не входит в стоимость.`,
  },
]

export function Documents() {
  return (
    <section id="documents" aria-labelledby="docs-title" className="lazy-section border-t border-line">
      <div className="shell py-16 sm:py-24">
        <SectionHead id="docs-title" copy={COPY.sections.documents} />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-14">
          {DOCS.map((d, i) => (
            <li key={d.href} className="reveal" style={revealOrder(i)}>
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
      </div>
    </section>
  )
}
