'use client'

import { type LeadRequest, useLanding } from './LandingProvider'

type LeadButtonProps = Omit<LeadRequest, 'title'> & {
  /** Текст кнопки — он же заголовок формы, если не задан formTitle. */
  children: string
  formTitle?: string
  className?: string
  icon?: React.ReactNode
}

export function LeadButton({ children, formTitle, className = 'btn btn-primary', icon, ...request }: LeadButtonProps) {
  const { openLead } = useLanding()
  return (
    <button type="button" className={className} onClick={() => openLead({ title: formTitle ?? children, ...request })}>
      {children}
      {icon}
    </button>
  )
}
