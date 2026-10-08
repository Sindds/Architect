import { Check, Minus } from 'lucide-react'
import { COPY } from '@/content/copy'
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
    <section id="pricing" aria-labelledby="pricing-title" className="shell py-16 sm:py-24">
      <SectionHead id="pricing-title" index={4} copy={COPY.sections.pricing} />

      <ol className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-3">
        {TIER_ORDER.map((tier, i) => {
          const t = PRICING.tiers[tier]
          const featured = tier === 'whitebox'
          const muted = featured ? 'text-on-inverse-muted' : 'text-muted'
          return (
            <li
              key={tier}
              className={`reveal flex flex-col rounded-3xl border p-6 sm:p-8 ${featured ? 'on-dark border-white/10 bg-inverse text-on-inverse shadow-2xl' : 'card'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className={`label num ${featured ? 'text-[#9fc0de]' : 'text-accent'}`}>Пакет {i + 1} из 3</p>
                {featured && <span className="label rounded-full bg-white/10 px-3 py-1.5 font-medium">Выбирают чаще</span>}
              </div>
              <h3 className="display mt-4 text-2xl font-bold">{t.title}</h3>
              <p className={`mt-2 ${muted}`}>{t.short}</p>

              <table className="num mt-6 w-full text-left">
                <caption className={`label mb-2 text-left font-medium ${muted}`}>Дом, ₽ за м²</caption>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Стиль</th>
                    <th scope="col">Цена за м²</th>
                  </tr>
                </thead>
                <tbody>
                  {STYLE_ORDER.map((style) => (
                    <tr key={style} className={`border-b ${featured ? 'border-white/10' : 'border-line'}`}>
                      <th scope="row" className="py-2 pr-2 font-normal">
                        {PRICING.styles[style].title}
                      </th>
                      <td className="py-2 text-right font-semibold whitespace-nowrap">от {groupDigits(minPriceFor(tier, style))} ₽</td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className={`py-2 pr-2 font-normal ${muted}`}>
                      Терраса
                    </th>
                    <td className={`py-2 text-right whitespace-nowrap ${muted}`}>{groupDigits(t.terracePerM2)} ₽</td>
                  </tr>
                </tbody>
              </table>
              <p className={`mt-3 text-sm ${muted}`}>
                Срок от {formatDays(daysFor(minArea, tier))} для дома {minArea} м²
              </p>

              <h4 className={`label mt-6 font-medium ${muted}`}>Входит</h4>
              <ul className="mt-2 grid gap-1.5">
                {t.includes.map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <Check aria-hidden className={`mt-1 size-4 shrink-0 ${featured ? 'text-[#7fd19b]' : 'text-ok'}`} />
                    {x}
                  </li>
                ))}
              </ul>
              <h4 className={`label mt-5 font-medium ${muted}`}>Не входит</h4>
              <ul className={`mt-2 mb-6 grid gap-1.5 ${muted}`}>
                {t.excludes.map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <Minus aria-hidden className="mt-1 size-4 shrink-0" />
                    {x}
                  </li>
                ))}
              </ul>
              <LeadButton source="pricing_pdf" context={`Пакет «${t.title}»`} className={`btn mt-auto w-full ${featured ? 'btn-light' : 'btn-ghost'}`}>
                Получить смету в PDF
              </LeadButton>
            </li>
          )
        })}
      </ol>

      <p className="mt-8 max-w-3xl rounded-2xl bg-accent-soft p-5 text-fg">
        Мы закрепляем цену в договоре. Пересчитать её можно только допсоглашением, если вы сами меняете проект.{' '}
        <a href={SITE.docs.contract} target="_blank" rel="noopener" className="link font-semibold">
          Образец договора (PDF)
        </a>
      </p>
    </section>
  )
}
