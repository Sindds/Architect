'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getReview } from '@/content/people'
import { PRICING } from '@/content/pricing'
import type { Case } from '@/content/types'
import { formatDayDelta, formatDays, formatDeviation, formatRub } from '@/lib/format'
import { daysFor, priceFor } from '@/lib/pricing'
import { LeadForm } from '../forms/LeadForm'
import { useLanding } from '../LandingProvider'
import { Modal } from '../ui/Modal'

export function CaseModal({ kase, onClose }: { kase: Case | undefined; onClose: () => void }) {
  return (
    <Modal open={Boolean(kase)} onClose={onClose} title={kase ? `«${kase.title}», ${kase.place}` : ''} testId="case-modal">
      {kase && <CaseBody kase={kase} />}
    </Modal>
  )
}

function CaseBody({ kase }: { kase: Case }) {
  const { variant } = useLanding()
  const [stage, setStage] = useState(0)
  const planPrice = priceFor(kase)
  const planDays = daysFor(kase.area, kase.tier, kase.addons)
  const review = getReview(kase.reviewId)
  const photo = kase.photos[stage] ?? kase.photos[0]
  const params = [
    PRICING.styles[kase.style].title,
    `${kase.area} м², терраса ${kase.terrace} м²`,
    PRICING.tiers[kase.tier].title.toLowerCase(),
    ...kase.addons.map((a) => PRICING.addons[a].title),
  ].join(' · ')

  return (
    <div className="grid gap-8 px-4 pb-8 pt-5 sm:px-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        {photo && (
          <figure>
            <Image src={photo.picture.src} alt={photo.picture.alt} sizes="(min-width: 1024px) 620px, 100vw" className="aspect-[16/10] w-full rounded-2xl bg-subtle object-cover" placeholder="blur" />
            <figcaption className="label mt-2 text-muted">
              {photo.stage} · {photo.picture.caption}
            </figcaption>
          </figure>
        )}
        <div className="mt-3 inline-flex gap-1 rounded-full border border-line bg-surface p-1" role="group" aria-label="Этап строительства на фото">
          {kase.photos.map((p, i) => (
            <button
              key={p.stage}
              type="button"
              aria-pressed={i === stage}
              onClick={() => setStage(i)}
              className="min-h-11 cursor-pointer rounded-full px-5 text-sm font-semibold transition-colors hover:bg-subtle aria-pressed:bg-fg aria-pressed:text-bg"
            >
              {p.stage}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5">
        <p className="label text-muted">{params}</p>
        <table className="num mt-4 w-full text-left">
          <caption className="sr-only">План и факт по смете и срокам</caption>
          <thead>
            <tr className="label border-b border-line-strong text-muted">
              <th scope="col" className="py-2 font-normal" />
              <th scope="col" className="py-2 font-normal">
                План
              </th>
              <th scope="col" className="py-2 font-normal">
                Факт
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line">
              <th scope="row" className="py-3 pr-2 font-normal text-muted">
                Смета
              </th>
              <td className="py-3 pr-2 whitespace-nowrap">{formatRub(planPrice)}</td>
              <td className="py-3 font-medium whitespace-nowrap">{formatRub(kase.factPrice)}</td>
            </tr>
            <tr className="border-b border-line">
              <th scope="row" className="py-3 pr-2 font-normal text-muted">
                Срок
              </th>
              <td className="py-3 pr-2 whitespace-nowrap">{formatDays(planDays)}</td>
              <td className="py-3 font-medium whitespace-nowrap">{formatDays(kase.factDays)}</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3">
          <span className="num font-medium text-accent">
            {formatDeviation(planPrice, kase.factPrice)} к смете, {formatDayDelta(planDays, kase.factDays)}.
          </span>{' '}
          {kase.deviationNote}
        </p>

        <dl className="mt-6 grid gap-4">
          {[
            ['Задача', kase.task],
            ['Решение', kase.solution],
            ['Результат', kase.result],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="label text-accent">{k}</dt>
              <dd className="mt-1">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {review && (
        <blockquote className="border-l-2 border-accent pl-5 lg:col-span-7">
          <p className="text-lg leading-relaxed">«{review.text}»</p>
          <footer className="mt-3 text-muted">
            {review.author} · {review.object}
            {review.isDemo && <span className="label ml-2">демо-отзыв</span>}
          </footer>
        </blockquote>
      )}

      <div className="rounded-3xl bg-subtle p-5 sm:p-6 lg:col-span-5">
        <p className="text-xl font-semibold">Посмотреть этот дом вживую</p>
        <p className="mt-1 mb-4 text-muted">Мы договоримся с владельцами и покажем этот дом или похожий объект на стройке.</p>
        <LeadForm source="case_modal" variant={variant} context={`Кейс «${kase.title}»`} submitLabel="Записаться на экскурсию" />
      </div>
    </div>
  )
}
