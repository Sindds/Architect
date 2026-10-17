'use client'

import { SITE } from '@/content/site'
import { LeadForm } from '../forms/LeadForm'
import { MessengerLinks, hasMessengerLinks } from '../MessengerLinks'
import { type LeadRequest, useLanding } from '../LandingProvider'
import { Modal } from '../ui/Modal'

// Абзацы вступления над формой. Срок ответа (SITE.callbackPromise) — там, где текст сам его не называет.
const INTRO: Partial<Record<LeadRequest['source'], string[]>> = {
  calculator: [`Смета в PDF по Вашим параметрам откроется сразу после отправки. Инженер перезвонит и ответит на вопросы о составе работ. ${SITE.callbackPromise}`],
  project_modal: [`Смета проекта в PDF откроется сразу после отправки. Архитектор перезвонит и расскажет, как адаптировать проект под Ваш участок. ${SITE.callbackPromise}`],
  quiz: [`Мы уточним детали по телефону и пришлём расчёт с вилкой цены и сроков. ${SITE.callbackPromise}`],
  messenger: ['Оставьте номер телефона — мы напишем Вам в выбранный мессенджер, ответим на вопросы о проекте, стоимости и сроках строительства. Свяжемся с Вами в течение рабочего дня.'],
  architect: [
    'Разберём особенности участка, Ваши пожелания к дому и ориентиры бюджета. Архитектор подскажет, какие планировочные и конструктивные решения подойдут именно Вам, на чём можно оптимизировать затраты и сколько может стоить реализация проекта.',
    `Оставьте номер телефона — архитектор ${SITE.brandFull} свяжется с Вами в течение рабочего дня.`,
  ],
}
const DEFAULT_INTRO = [`Оставьте имя и телефон, мы перезвоним и ответим на вопросы. ${SITE.callbackPromise}`]

export function LeadModal({ request, onClose }: { request: LeadRequest | null; onClose: () => void }) {
  const { variant } = useLanding()
  return (
    <Modal open={request !== null} onClose={onClose} title={request?.title ?? ''} size="sm" testId="lead-modal">
      {request && (
        <div className="px-4 pb-6 pt-4 sm:px-8 sm:pb-8">
          <div className="mb-5 grid gap-2 text-muted">
            {(request.intro ?? INTRO[request.source] ?? DEFAULT_INTRO).map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          {request.context && <p className="label mb-4 text-accent">{request.context}</p>}
          {request.source === 'messenger' && hasMessengerLinks && (
            <div className="mb-5 grid gap-2">
              <p className="text-sm font-medium">Написать сразу, без формы:</p>
              <div className="flex flex-wrap gap-2">
                <MessengerLinks className="btn btn-primary min-h-11" />
              </div>
              <p className="mt-2 text-sm text-muted">Или оставьте номер, и мы напишем сами.</p>
            </div>
          )}
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
