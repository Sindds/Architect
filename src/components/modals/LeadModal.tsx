'use client'

import { LEAD_MODAL_TEXT as T } from '@/content/texts'
import { LeadForm } from '../forms/LeadForm'
import { MessengerLinks, hasMessengerLinks } from '../MessengerLinks'
import { type LeadRequest, useLanding } from '../LandingProvider'
import { Modal } from '../ui/Modal'

// Абзацы вступления над формой — texts.ts, LEAD_MODAL_TEXT.
const INTRO = T.intro
const DEFAULT_INTRO = T.defaultIntro

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
              <p className="text-sm font-medium">{T.messengersTitle}</p>
              <div className="flex flex-wrap gap-2">
                <MessengerLinks className="btn btn-primary min-h-11" />
              </div>
              <p className="mt-2 text-sm text-muted">{T.messengersNote}</p>
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
