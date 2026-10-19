import { ArrowUpRight, FileText } from 'lucide-react'
import { COMMON_TEXT, COPY, DOCUMENTS_TEXT as T } from '@/content/texts'
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
    title: T.contractTitle,
    about: T.contractAbout,
  },
  {
    href: SITE.docs.estimate,
    title: T.estimateTitle(ESTIMATE_SAMPLE.name, formatRub(sheet.total)),
    about: T.estimateAbout(`${lines} ${plural(lines, ['позиция', 'позиции', 'позиций'])}`, sheet.sections.length),
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
                    {COMMON_TEXT.openPdf} <ArrowUpRight aria-hidden className="size-3.5" />
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
