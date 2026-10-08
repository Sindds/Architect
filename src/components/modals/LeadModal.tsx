'use client'

import { SITE } from '@/content/site'
import { LeadForm } from '../forms/LeadForm'
import { type LeadRequest, useLanding } from '../LandingProvider'
import { Modal } from '../ui/Modal'

const INTRO: Partial<Record<LeadRequest['source'], string>> = {
  excursion: 'Покажем построенный дом и стройку на нужном вам этапе. Подберём объект поближе и согласуем время.',
  pricing_pdf: 'Пришлём смету в PDF с разбивкой по этапам и списком «входит / не входит».',
  calculator: 'Пришлём смету в PDF по вашим параметрам и ответим на вопросы по составу работ.',
  quiz: 'Уточним детали по телефону и пришлём расчёт с вилкой цены и сроков.',
  messenger: 'Оставьте номер — напишем в выбранный мессенджер.',
}

export function LeadModal({ request, onClose }: { request: LeadRequest | null; onClose: () => void }) {
  const { variant } = useLanding()
  return (
    <Modal open={request !== null} onClose={onClose} title={request?.title ?? ''} size="sm" testId="lead-modal">
      {request && (
        <div className="px-4 pb-6 pt-4 sm:px-8 sm:pb-8">
          <p className="mb-5 text-ink-2">
            {INTRO[request.source] ?? 'Оставьте имя и телефон — перезвоним и ответим на вопросы.'} {SITE.callbackPromise}
          </p>
          {request.context && <p className="label mb-4 text-accent">{request.context}</p>}
          <LeadForm
            source={request.source}
            variant={variant}
            context={request.context}
            estimate={request.estimate}
            quiz={request.quiz}
            extended={request.extended}
            submitLabel={request.submitLabel}
            contactMethod={request.contactMethod}
          />
        </div>
      )}
    </Modal>
  )
}
