import { Plus } from 'lucide-react'
import { FAQ } from '@/content/process'
import { SectionHead } from '../ui/SectionHead'

export function Faq() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer.join(' ') },
    })),
  }
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-line py-16 lg:py-24">
      <div className="shell grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHead id="faq-title" index="10" label="Вопросы" title="Отвечаем до того, как вы спросите" />
        </div>
        <div className="lg:col-span-8">
          <ul className="border-t border-ink">
            {FAQ.map((f) => (
              <li key={f.question} className="border-b border-line">
                <details className="group">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                    {f.question}
                    <Plus aria-hidden className="size-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none" />
                  </summary>
                  <div className="grid gap-3 pb-6 pr-10 text-ink-2">
                    {f.answer.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </section>
  )
}
