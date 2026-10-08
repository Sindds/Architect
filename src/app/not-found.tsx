import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export default function NotFound() {
  return (
    <main className="sheet-grid grid min-h-dvh place-items-center px-4">
      <div className="max-w-xl text-center">
        <Logo className="justify-center" />
        <p className="label mt-12 text-accent">Ошибка 404</p>
        <h1 className="mt-4 font-display text-h2 font-medium">Такой страницы нет на чертеже</h1>
        <p className="mt-4 text-lg text-ink-2">Возможно, ссылка устарела. Все проекты, цены и расчёт — на главной.</p>
        <Link href="/" className="btn btn-primary mt-8">
          На главную
        </Link>
      </div>
    </main>
  )
}
