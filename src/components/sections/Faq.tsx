import { Plus } from 'lucide-react'
import { COPY } from '@/content/copy'
import { FAQ } from '@/content/process'
import { SectionHead } from '../ui/SectionHead'

export function Faq() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer.join(' ') } })),
  }
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-line">
      <div className="shell py-16 sm:py-24">
        <SectionHead id="faq-title" index={10} copy={COPY.sections.faq} />
        <ul className="mt-10 grid gap-3 lg:mt-14 lg:ml-[25%]">
          {FAQ.map((f) => (
            <li key={f.question}>
              <details className="group card open:border-line-strong">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 px-5 py-4 text-lg font-semibold sm:px-6 [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-subtle text-accent transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none">
                    <Plus className="size-4" />
                  </span>
                </summary>
                <div className="grid gap-3 px-5 pb-6 text-muted sm:px-6 sm:pr-16">
                  {f.answer.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </section>
  )
}
