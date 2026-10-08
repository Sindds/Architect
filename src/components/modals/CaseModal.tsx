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
            <Image src={photo.picture.src} alt={photo.picture.alt} sizes="(min-width: 1024px) 620px, 100vw" className="aspect-[16/10] w-full bg-paper-2 object-cover" placeholder="blur" />
            <figcaption className="label mt-2 text-ink-2">
              {photo.stage} · {photo.picture.caption}
            </figcaption>
          </figure>
        )}
        <div className="mt-3 inline-flex border border-ink-3" role="group" aria-label="Этап строительства на фото">
          {kase.photos.map((p, i) => (
            <button
              key={p.stage}
              type="button"
              aria-pressed={i === stage}
              onClick={() => setStage(i)}
              className="min-h-11 cursor-pointer px-5 text-sm font-medium transition-colors aria-pressed:bg-ink aria-pressed:text-sheet"
            >
              {p.stage}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5">
        <p className="label text-ink-2">{params}</p>
        <table className="num mt-4 w-full text-left">
          <caption className="sr-only">План и факт по смете и срокам</caption>
          <thead>
            <tr className="label border-b border-ink text-ink-2">
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
              <th scope="row" className="py-3 pr-2 font-normal text-ink-2">
                Смета
              </th>
              <td className="py-3 pr-2 whitespace-nowrap">{formatRub(planPrice)}</td>
              <td className="py-3 font-medium whitespace-nowrap">{formatRub(kase.factPrice)}</td>
            </tr>
            <tr className="border-b border-line">
              <th scope="row" className="py-3 pr-2 font-normal text-ink-2">
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
          <p className="font-display text-2xl italic leading-snug">«{review.text}»</p>
          <footer className="mt-3 text-ink-2">
            {review.author} · {review.object}
            {review.isDemo && <span className="label ml-2">демо-отзыв</span>}
          </footer>
        </blockquote>
      )}

      <div className="bg-paper p-5 lg:col-span-5">
        <p className="font-display text-2xl">Посмотреть этот дом вживую</p>
        <p className="mt-1 mb-4 text-ink-2">Договоримся с владельцами и покажем дом или похожий объект на стройке.</p>
        <LeadForm source="case_modal" variant={variant} context={`Кейс «${kase.title}»`} submitLabel="Записаться на экскурсию" />
      </div>
    </div>
  )
}
