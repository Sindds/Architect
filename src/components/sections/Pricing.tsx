import { Check, Minus } from "lucide-react";
import { COMMON_TEXT, COPY, PRICING_TEXT as T } from "@/content/texts";
import { CALC_DEFAULTS, PRICING, STYLE_ORDER, TIER_ORDER } from "@/content/pricing";
import { PROJECTS } from "@/content/projects";
import { SITE } from "@/content/site";
import type { Style } from "@/content/types";
import { formatDaysFrom, groupDigits, plural } from "@/lib/format";
import { nbsp } from "@/lib/typography";
import { daysFor, estimateFor, minPriceFor } from "@/lib/pricing";
import { smetaLayout, type SmetaInput } from "@/lib/smeta-token";
import { LeadButton } from "../LeadButton";
import { PackageDetails } from "./PackageDetails";
import { SectionHead } from "../ui/SectionHead";
import { revealOrder } from "@/lib/reveal";

/** «с 83 позициями в 14 разделах» — та же смета, что сервер соберёт в PDF по этим параметрам. */
function smetaSize(input: SmetaInput): string {
  const sheet = estimateFor({ ...input, ...smetaLayout(input.area) });
  const lines = sheet.sections.reduce((n, s) => n + s.lines.length, 0);
  return `с ${lines} ${plural(lines, ["позицией", "позициями", "позициями"])} в ${sheet.sections.length} ${plural(sheet.sections.length, ["разделе", "разделах", "разделах"])}`;
}

/** Смета пакета в PDF — для дома по умолчанию из калькулятора (CALC_DEFAULTS): площадь и терраса те же, без опций. */
export function Pricing({ defaultStyle }: { defaultStyle: Style }) {
  const minArea = Math.min(...PROJECTS.map((p) => p.area));
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="shell py-16 sm:py-24"
    >
      <SectionHead id="pricing-title" copy={COPY.sections.pricing} />

      <ol
        className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-3"
        aria-label={T.listLabel}
      >
        {TIER_ORDER.map((tier, i) => {
          const t = PRICING.tiers[tier];
          const smeta: SmetaInput = { area: CALC_DEFAULTS.area, terrace: CALC_DEFAULTS.terrace, style: defaultStyle, tier, addons: [] };
          const featured = tier === "whitebox";
          const muted = featured ? "text-on-inverse-muted" : "text-muted";
          return (
            <li
              key={tier}
              style={revealOrder(i)}
              className="reveal"
            >
              <div className={`card-hover relative flex h-full flex-col rounded-3xl border p-5 sm:p-8 ${featured ? "on-dark border-white/10 bg-inverse text-on-inverse shadow-2xl" : "card"}`}>
              <div className="flex items-center justify-between gap-3">
                <p
                  className={`label num ${featured ? "text-[#9fc0de]" : "text-accent"}`}
                >
                  {T.counter(i + 1, TIER_ORDER.length)}
                </p>
                {featured && (
                  <span className="label rounded-full bg-white/10 px-3 py-1.5 font-medium">
                    {T.featured}
                  </span>
                )}
              </div>
              <h3 className="display mt-4 text-2xl font-bold">{t.title}</h3>
              <p className={`mt-2 text-[0.9375rem] leading-snug sm:text-base sm:leading-normal ${muted}`}>{nbsp(t.short)}</p>

              <table className="num mt-5 w-full text-left sm:mt-6">
                <caption
                  className={`label mb-2 text-left font-medium ${muted}`}
                >
                  {T.tableCaption}
                </caption>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">{T.columns.style}</th>
                    <th scope="col">{T.columns.price}</th>
                  </tr>
                </thead>
                <tbody>
                  {STYLE_ORDER.map((style) => (
                    <tr
                      key={style}
                      className={`border-b ${featured ? "border-white/10" : "border-line"}`}
                    >
                      <th scope="row" className="py-1 pr-2 font-normal sm:py-2">
                        {PRICING.styles[style].title}
                      </th>
                      <td className="py-1 text-right font-semibold whitespace-nowrap sm:py-2">
                        {T.priceFrom(groupDigits(minPriceFor(tier, style)))}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th
                      scope="row"
                      className={`py-1 pr-2 font-normal sm:py-2 ${muted}`}
                    >
                      {T.terrace}
                    </th>
                    <td
                      className={`py-1 text-right whitespace-nowrap sm:py-2 ${muted}`}
                    >
                      {groupDigits(t.terracePerM2)} ₽
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className={`mt-3 text-sm ${muted}`}>
                {T.term(formatDaysFrom(daysFor(minArea, tier)), minArea)}
              </p>

              <PackageDetails
                summaryClassName={`label mt-5 flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-medium ${muted}`}
              >
                <h4 className={`label mt-2 font-medium ${muted}`}>{T.includes}</h4>
                <ul className="mt-2 grid gap-1.5">
                  {t.includes.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <Check
                        aria-hidden
                        className={`mt-1 size-4 shrink-0 ${featured ? "text-[#7fd19b]" : "text-ok"}`}
                      />
                      {x}
                    </li>
                  ))}
                </ul>
                <h4 className={`label mt-5 font-medium ${muted}`}>{T.excludes}</h4>
                <ul className={`mt-2 grid gap-1.5 ${muted}`}>
                  {t.excludes.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <Minus aria-hidden className="mt-1 size-4 shrink-0" />
                      {x}
                    </li>
                  ))}
                </ul>
              </PackageDetails>
              <LeadButton
                source="pricing_pdf"
                formTitle={COPY.smetaTitle}
                intro={COPY.smetaIntro(smetaSize(smeta))}
                context={T.leadContext(t.title)}
                smeta={smeta}
                className={`btn mt-auto w-full ${featured ? "btn-light" : "btn-ghost"}`}
              >
                {COMMON_TEXT.getSmetaPdf}
              </LeadButton>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 max-w-3xl rounded-2xl bg-accent-soft p-5 text-fg">
        {T.note}{" "}
        <a
          href={SITE.docs.contract}
          target="_blank"
          rel="noopener"
          className="link font-semibold"
        >
          {T.contractLink}
        </a>
      </p>
    </section>
  );
}
