import type { SectionCopy } from '@/content/copy'
import { nbsp } from '@/lib/typography'

interface SectionHeadProps {
  id: string
  copy: SectionCopy
  /** Подзаголовок, если он собирается из цифр (например, срок по этапам). */
  lead?: string
  tone?: 'light' | 'dark'
}

/** Заголовок секции по образцу: слева метка моноширинным шрифтом, справа крупный заголовок прописными. */
export function SectionHead({ id, copy, lead, tone = 'light' }: SectionHeadProps) {
  const dark = tone === 'dark'
  const text = lead ?? copy.lead
  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-12">
      <p data-testid="section-label" className={`label lg:col-span-3 lg:pt-3 ${dark ? 'text-[#9fc0de]' : 'text-accent'}`}>
        {copy.label}
      </p>
      <div className="lg:col-span-9">
        <h2 id={id} className="display text-[1.6rem] leading-[1.12] font-normal sm:text-4xl lg:text-[2.9rem]">
          {nbsp(copy.title)}
        </h2>
        {text && <p className={`mt-4 max-w-3xl text-base leading-relaxed sm:text-lg ${dark ? 'text-on-inverse-muted' : 'text-muted'}`}>{nbsp(text)}</p>}
      </div>
    </div>
  )
}
