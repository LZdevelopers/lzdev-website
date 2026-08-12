import { useEffect, useRef, useState } from 'react'
import { navLinks } from '../../data/site'
import { usePageProgress } from '../../hooks/usePageProgress'
import { useScrolled } from '../../hooks/useScrolled'
import { Button } from '../primitives/Button'
import { Icon } from '../primitives/Icon'
import { Logo } from './Logo'

export function Navbar() {
  const scrolled = useScrolled(20)
  const progress = usePageProgress()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const triggerRef = useRef(null)

  // Bloqueia o scroll do body e devolve o foco ao botão ao fechar o drawer.
  useEffect(() => {
    if (!open) return

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      // Trap de foco simples dentro do painel
      const focusables = panelRef.current.querySelectorAll('a[href], button:not([disabled])')
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
      triggerRef.current?.focus()
    }
  }, [open])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500 ease-[var(--ease-out-soft)] ${
        scrolled || open
          ? 'border-b border-white/8 bg-bg/72 backdrop-blur-xl shadow-[0_10px_30px_-20px_rgb(0_0_0/0.9)]'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* Três colunas para o menu ficar opticamente centralizado na tela,
          independente da largura do logo e do CTA. */}
      <nav
        className="container-page grid h-18 grid-cols-[auto_1fr_auto] items-center gap-6"
        aria-label="Navegação principal"
      >
        <a href="#inicio" className="rounded-lg" aria-label="LZdev — início">
          <Logo compact />
        </a>

        {/* Links — desktop */}
        <ul className="hidden lg:flex items-center justify-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative rounded-lg px-3.5 py-2 text-sm font-medium text-muted transition-colors duration-300 hover:text-ink after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-cat-1 after:to-cat-2 after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="col-start-3 flex items-center justify-end gap-2">
          {/* O wrapper é que esconde: `hidden` na própria Button perderia para o
              `inline-flex` das classes base dela na ordem final do CSS. */}
          <div className="hidden sm:block">
            <Button href="#contato" size="md" variant="glass" pill icon="send" iconPosition="left">
              Solicitar projeto
            </Button>
          </div>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-ink transition-colors hover:border-brand/40"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            <Icon name={open ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </nav>

      {/* Barra de progresso da leitura. Só aparece depois que a navbar ganha
          fundo, senão flutuaria sozinha sobre o hero. `scaleX` a partir da
          esquerda: anima no compositor, sem recalcular layout a cada quadro. */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-cat-1 via-cat-2 to-cat-3 transition-opacity duration-500 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />

      {/* Drawer — mobile/tablet */}
      <div
        id="menu-mobile"
        ref={panelRef}
        hidden={!open}
        className="lg:hidden border-t border-white/8 bg-bg/95 backdrop-blur-xl"
      >
        <ul className="container-page flex flex-col gap-1 py-5">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-muted transition-colors hover:bg-white/[0.05] hover:text-ink"
              >
                {link.label}
                <span className="font-mono text-xs text-faint">0{i + 1}</span>
              </a>
            </li>
          ))}
          <li className="mt-3">
            <Button href="#contato" size="lg" className="w-full" icon="arrowRight" onClick={() => setOpen(false)}>
              Solicitar projeto
            </Button>
          </li>
        </ul>
      </div>
    </header>
  )
}
