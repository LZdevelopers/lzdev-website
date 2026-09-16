import { useEffect, useRef, useState } from 'react'
import { navLinks, primaryCta } from '../../data/site'
import { afterTwoFrames, scrollToAnchor } from '../../lib/anchors'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useHeaderHeight } from '../../hooks/useHeaderHeight'
import { useScrolled } from '../../hooks/useScrolled'
import { Button } from '../primitives/Button'
import { Icon } from '../primitives/Icon'
import { Logo } from './Logo'

/**
 * Navbar fixa. Ao rolar, ela ganha fundo com blur, uma borda de 1px e uma sombra
 * curta — nada mais. A barra de progresso de leitura que crescia sob a borda foi
 * removida: numa landing page de dez seções ela virava um elemento em movimento
 * permanente no topo da tela, competindo com o conteúdo sem informar nada que a
 * própria rolagem já não diga.
 *
 * O menu marca a seção que está sendo lida (`useActiveSection`): num site de uma
 * página só, o menu é a única coisa capaz de dizer "você está aqui". A marcação
 * é dupla de propósito — a cor do texto sobe para o branco E o traço de baixo
 * fica aceso —, porque cor sozinha não serve para quem não a distingue. Para o
 * leitor de tela é `aria-current`.
 */
const NAV_IDS = navLinks.map((link) => link.href.slice(1))

export function Navbar() {
  /**
   * A altura medida é a da FAIXA (o <nav>), não a do <header> inteiro.
   * O painel do celular é filho do header: com ele aberto, o header mede a
   * faixa + o painel, e `--header-h` passaria a valer 300px e sobrando. Quem
   * cobre o conteúdo é sempre a faixa.
   */
  const navRef = useRef(null)
  const scrolled = useScrolled(20)
  const activeId = useActiveSection(NAV_IDS)
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const triggerRef = useRef(null)

  // A altura real da barra vira `--header-h`, que o CSS usa para descontar a
  // barra ao parar a rolagem numa âncora. Ver src/hooks/useHeaderHeight.js.
  useHeaderHeight(navRef)

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

    // Toque fora do painel fecha: no celular é o gesto que todo mundo tenta
    // antes de procurar o X, e sem ele o menu parece travado.
    const onPointerDown = (event) => {
      if (!panelRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      triggerRef.current?.focus()
    }
  }, [open])

  /**
   * Item do menu do celular: fecha o painel e SÓ DEPOIS rola.
   *
   * Com o painel aberto, a rolagem do body está travada (`overflow: hidden`,
   * senão a página rola atrás do painel). O navegador processa o salto da âncora
   * no MESMO instante do clique — antes de o React fechar o painel e devolver a
   * rolagem —, então ele tenta rolar um documento travado e o menu fecha com a
   * página parada onde estava. É o clássico "o menu do celular não vai para a
   * seção". Detalhes em src/lib/anchors.js.
   */
  const onDrawerLink = (href) => (event) => {
    event.preventDefault()
    setOpen(false)
    afterTwoFrames(() => scrollToAnchor(href))
  }

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
        ref={navRef}
        className="container-page grid h-18 grid-cols-[auto_1fr_auto] items-center gap-6"
        aria-label="Navegação principal"
      >
        <a href="/" className="rounded-lg" aria-label="LZdev — voltar ao início da página">
          <Logo compact />
        </a>

        {/* Links — desktop */}
        <ul className="hidden lg:flex items-center justify-center gap-1">
          {navLinks.map((link) => {
            const current = activeId === link.href.slice(1)
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={current ? 'true' : undefined}
                  className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-300 after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-px after:origin-left after:bg-gradient-to-r after:from-cat-1 after:to-cat-2 after:transition-transform after:duration-300 hover:text-ink hover:after:scale-x-100 ${
                    current ? 'text-ink after:scale-x-100' : 'text-muted after:scale-x-0'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="col-start-3 flex items-center justify-end gap-2">
          {/* O wrapper é que esconde: `hidden` na própria Button perderia para o
              `inline-flex` das classes base dela na ordem final do CSS. */}
          <div className="hidden sm:block">
            <Button href="/contato" size="md" variant="glass" pill icon="send" iconPosition="left">
              {primaryCta}
            </Button>
          </div>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-ink transition-colors hover:border-brand/40"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          >
            <Icon name={open ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </nav>

      {/* Drawer — mobile/tablet. Os números "01 02 03" que ficavam à direita de
          cada item saíram: numeravam uma lista que não tem ordem nenhuma. */}
      <div
        id="menu-mobile"
        ref={panelRef}
        hidden={!open}
        className="lg:hidden border-t border-white/8 bg-bg/95 backdrop-blur-xl"
      >
        <ul className="container-page flex flex-col gap-1 py-5">
          {navLinks.map((link) => {
            const current = activeId === link.href.slice(1)
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={current ? 'true' : undefined}
                  onClick={onDrawerLink(link.href)}
                  className={`block rounded-xl px-4 py-3.5 text-base font-medium transition-colors hover:bg-white/[0.05] hover:text-ink ${
                    current ? 'bg-white/[0.06] text-ink' : 'text-muted'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
          <li className="mt-3">
            <Button href="/contato" size="lg" className="w-full" icon="arrowRight" onClick={onDrawerLink('/contato')}>
              {primaryCta}
            </Button>
          </li>
        </ul>
      </div>
    </header>
  )
}
