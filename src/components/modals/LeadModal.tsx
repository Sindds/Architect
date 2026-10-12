'use client'

import { SITE } from '@/content/site'
import { LeadForm } from '../forms/LeadForm'
import { type LeadRequest, useLanding } from '../LandingProvider'
import { Modal } from '../ui/Modal'

const INTRO: Partial<Record<LeadRequest['source'], string>> = {
  excursion: 'Мы покажем построенный дом и стройку на нужном вам этапе. Подберём объект поближе и согласуем время.',
  pricing_pdf: 'Смета в PDF с разбивкой по разделам и этапам откроется сразу после отправки. Инженер перезвонит и ответит на вопросы о пакете.',
  calculator: 'Смета в PDF по вашим параметрам откроется сразу после отправки. Инженер перезвонит и ответит на вопросы о составе работ.',
  project_modal: 'Смета проекта в PDF откроется сразу после отправки. Архитектор перезвонит и расскажет, как адаптировать проект под ваш участок.',
  quiz: 'Мы уточним детали по телефону и пришлём расчёт с вилкой цены и сроков.',
  messenger: 'Оставьте номер, и мы напишем вам в выбранный мессенджер.',
  architect: 'Архитектор перезвонит, выслушает, что вы задумали, и подскажет, какой проект подойдёт вашему участку.',
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
            smeta={request.smeta}
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
