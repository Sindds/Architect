import type { SectionCopy } from '@/content/copy'

interface SectionHeadProps {
  id: string
  index: number
  copy: SectionCopy
  /** Подзаголовок, если он собирается из цифр (например, срок по этапам). */
  lead?: string
  tone?: 'light' | 'dark'
  total?: number
}

/** Заголовок секции по образцу: слева метка моноширинным шрифтом, справа крупный заголовок прописными. */
export function SectionHead({ id, index, copy, lead, tone = 'light', total = 11 }: SectionHeadProps) {
  const dark = tone === 'dark'
  const text = lead ?? copy.lead
  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-3">
        <p data-testid="section-label" className={`label ${dark ? 'text-[#9fc0de]' : 'text-accent'}`}>
          {copy.label}
        </p>
        <p className={`label num mt-1 font-normal ${dark ? 'text-on-inverse-muted' : 'text-muted'}`}>
          {String(index).padStart(2, '0')} / {total}
        </p>
      </div>
      <div className="lg:col-span-9">
        <h2 id={id} className="display text-[1.75rem] leading-[1.1] font-normal sm:text-4xl lg:text-[2.9rem]">
          {copy.title}
        </h2>
        {text && <p className={`mt-4 max-w-3xl text-base leading-relaxed sm:text-lg ${dark ? 'text-on-inverse-muted' : 'text-muted'}`}>{text}</p>}
      </div>
    </div>
  )
}
