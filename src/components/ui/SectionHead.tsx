interface SectionHeadProps {
  id: string
  index: string
  label: string
  title: string
  lead?: string
  tone?: 'light' | 'dark'
  aside?: React.ReactNode
}

/** Заголовок секции: номер листа и раздел — как в штампе чертежа, затем H2 и лид. */
export function SectionHead({ id, index, label, title, lead, tone = 'light', aside }: SectionHeadProps) {
  const muted = tone === 'dark' ? 'text-on-graphite-2' : 'text-ink-2'
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-8">
        <p className={`label flex items-center gap-3 ${tone === 'dark' ? 'text-accent-on-dark' : 'text-accent'}`}>
          <span className="num">{index}</span>
          <span aria-hidden className="h-px w-8 bg-current" />
          <span>{label}</span>
        </p>
        <h2 id={id} className="mt-4 font-display text-h2 font-medium tracking-[-0.01em]">
          {title}
        </h2>
        {lead && <p className={`mt-4 max-w-2xl text-lg ${muted}`}>{lead}</p>}
      </div>
      {aside && <div className="lg:col-span-4 lg:justify-self-end">{aside}</div>}
    </div>
  )
}
