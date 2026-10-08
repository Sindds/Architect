'use client'

import { type LeadRequest, useLanding } from './LandingProvider'

type LeadButtonProps = Omit<LeadRequest, 'title'> & {
  /** Текст кнопки — он же заголовок формы, если не задан formTitle. */
  children: string
  formTitle?: string
  className?: string
  /** Класс для текста кнопки (если текст оформлен иначе, чем сама кнопка). */
  textClassName?: string
  /** Иконка перед текстом. */
  leading?: React.ReactNode
  /** Иконка после текста. */
  icon?: React.ReactNode
}

export function LeadButton({ children, formTitle, className = 'btn btn-primary', textClassName, leading, icon, ...request }: LeadButtonProps) {
  const { openLead } = useLanding()
  return (
    <button type="button" className={className} onClick={() => openLead({ title: formTitle ?? children, ...request })}>
      {leading}
      {textClassName ? <span className={textClassName}>{children}</span> : children}
      {icon}
    </button>
  )
}
