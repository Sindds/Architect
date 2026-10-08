import { Check, Minus } from 'lucide-react'
import { PRICING, STYLE_ORDER, TIER_ORDER } from '@/content/pricing'
import { PROJECTS } from '@/content/projects'
import { SITE } from '@/content/site'
import { formatDays, groupDigits } from '@/lib/format'
import { daysFor, minPriceFor } from '@/lib/pricing'
import { LeadButton } from '../LeadButton'
import { SectionHead } from '../ui/SectionHead'

export function Pricing() {
  const minArea = Math.min(...PROJECTS.map((p) => p.area))
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="border-t border-line py-16 lg:py-24">
      <div className="shell">
        <SectionHead
          id="pricing-title"
          index="04"
          label="Цены"
          title="Три пакета готовности. Цена за м² зависит от стиля"
          lead="Ставки ниже — те же, что в калькуляторе и в карточках проектов. Терраса считается отдельно."
        />

        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIER_ORDER.map((tier, i) => {
            const t = PRICING.tiers[tier]
            const featured = tier === 'whitebox'
            return (
              <li key={tier} className={`reveal flex flex-col border p-6 lg:p-7 ${featured ? 'border-ink bg-sheet' : 'border-line bg-paper'}`}>
                <p className="label num text-ink-3">Пакет {i + 1} из 3</p>
                <h3 className="mt-3 font-display text-[2rem] font-medium leading-tight">{t.title}</h3>
                <p className="mt-2 text-ink-2">{t.short}</p>

                <table className="num mt-6 w-full text-left">
                  <caption className="label mb-2 text-left text-ink-2">Дом, ₽ за м²</caption>
                  <thead className="sr-only">
                    <tr>
                      <th scope="col">Стиль</th>
                      <th scope="col">Цена за м²</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STYLE_ORDER.map((style) => (
                      <tr key={style} className="border-b border-line">
                        <th scope="row" className="py-2 pr-2 font-normal">
                          {PRICING.styles[style].title}
                        </th>
                        <td className="py-2 text-right font-medium whitespace-nowrap">от {groupDigits(minPriceFor(tier, style))} ₽</td>
                      </tr>
                    ))}
                    <tr>
                      <th scope="row" className="py-2 pr-2 font-normal text-ink-2">
                        Терраса
                      </th>
                      <td className="py-2 text-right whitespace-nowrap text-ink-2">{groupDigits(t.terracePerM2)} ₽</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-3 text-sm text-ink-2">
                  Срок: от {formatDays(daysFor(minArea, tier))} для дома {minArea} м²
                </p>

                <h4 className="label mt-6 text-ink-2">Входит</h4>
                <ul className="mt-2 grid gap-1.5">
                  {t.includes.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-ok" />
                      {x}
                    </li>
                  ))}
                </ul>
                <h4 className="label mt-5 text-ink-2">Не входит</h4>
                <ul className="mt-2 mb-6 grid gap-1.5 text-ink-2">
                  {t.excludes.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <Minus aria-hidden className="mt-1 size-4 shrink-0" />
                      {x}
                    </li>
                  ))}
                </ul>
                <LeadButton
                  source="pricing_pdf"
                  context={`Пакет «${t.title}»`}
                  className={`btn mt-auto ${featured ? 'btn-primary' : 'btn-ghost'}`}
                >
                  Получить смету в PDF
                </LeadButton>
              </li>
            )
          })}
        </ol>

        <p className="mt-8 max-w-3xl border-l-2 border-accent pl-4 text-ink-2">
          Цена фиксируется в договоре. Меняется только по допсоглашению, если вы сами меняете проект.{' '}
          <a href={SITE.docs.contract} target="_blank" rel="noopener" className="link text-ink">
            Образец договора (PDF)
          </a>
        </p>
      </div>
    </section>
  )
}
