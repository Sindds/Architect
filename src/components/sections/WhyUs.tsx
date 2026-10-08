import { ArrowUpRight } from 'lucide-react'
import { WHY_US } from '@/content/process'
import { SectionHead } from '../ui/SectionHead'

export function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="border-t border-line py-16 lg:py-24">
      <div className="shell">
        <SectionHead
          id="why-title"
          index="01"
          label="Почему мы"
          title="Каждое обещание можно проверить до подписания договора"
          lead="Не пишем «надёжно» и «качественно». Показываем документы, сметы и сроки — смотрите сами."
        />
        <ol className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {WHY_US.map((item, i) => (
            <li key={item.title} className="reveal flex flex-col bg-paper p-6 lg:p-7">
              <span className="label num text-ink-3">0{i + 1}</span>
              <h3 className="mt-6 font-display text-[1.75rem] font-medium leading-tight">{item.title}</h3>
              <p className="mt-3 text-ink-2">{item.fact}</p>
              <a
                href={item.proof.href}
                {...(item.proof.href.endsWith('.pdf') ? { target: '_blank', rel: 'noopener' } : {})}
                className="link mt-auto inline-flex items-center gap-1.5 pt-6 font-medium"
              >
                {item.proof.label}
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
