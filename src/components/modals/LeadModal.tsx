'use client'

import { SITE } from '@/content/site'
import { LeadForm } from '../forms/LeadForm'
import { type LeadRequest, useLanding } from '../LandingProvider'
import { Modal } from '../ui/Modal'

const INTRO: Partial<Record<LeadRequest['source'], string>> = {
  excursion: 'Мы покажем построенный дом и стройку на нужном вам этапе. Подберём объект поближе и согласуем время.',
  pricing_pdf: 'Мы пришлём смету в PDF с разбивкой по этапам и списком того, что входит в пакет.',
  calculator: 'Мы пришлём смету в PDF по вашим параметрам и ответим на вопросы о составе работ.',
  quiz: 'Мы уточним детали по телефону и пришлём расчёт с вилкой цены и сроков.',
  messenger: 'Оставьте номер, и мы напишем вам в выбранный мессенджер.',
}

export function LeadModal({ request, onClose }: { request: LeadRequest | null; onClose: () => void }) {
  const { variant } = useLanding()
  return (
    <Modal open={request !== null} onClose={onClose} title={request?.title ?? ''} size="sm" testId="lead-modal">
      {request && (
        <div className="px-4 pb-6 pt-4 sm:px-8 sm:pb-8">
          <p className="mb-5 text-muted">
            {INTRO[request.source] ?? 'Оставьте имя и телефон, мы перезвоним и ответим на вопросы.'} {SITE.callbackPromise}
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
