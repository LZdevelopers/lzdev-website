import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'

/**
 * Carrossel de um item por vez.
 *
 * Substitui as grades de 2 e 3 colunas de Projetos e Diferenciais: com um card
 * só na tela cada item ganha o espaço para mostrar detalhe de verdade, e a
 * seção inteira passa a ocupar a altura de UM card em vez da soma de todos.
 *
 * A rolagem é NATIVA (`overflow-x` + `scroll-snap`), não um `transform`
 * controlado por estado. Isso entrega de graça o swipe no celular, o gesto
 * horizontal do trackpad e o arrasto da barra — e as setas viram apenas mais
 * uma forma de chegar ao mesmo lugar, em vez da única. O índice ativo é lido da
 * posição de rolagem (num rAF), então os pontinhos e o contador acompanham
 * qualquer uma dessas formas.
 *
 * Teclado: ← e → navegam quando o foco está dentro do carrossel; o conteúdo de
 * cada slide continua tabulável na ordem natural.
 */
export function Carousel({ items, label, renderSlide, slideKey, className = '' }) {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const total = items.length

  const goTo = useCallback(
    (target) => {
      const track = trackRef.current
      if (!track) return
      const slide = track.children[Math.max(0, Math.min(target, total - 1))]
      if (!slide) return
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      track.scrollTo({ left: slide.offsetLeft, behavior: smooth ? 'smooth' : 'auto' })
    },
    [total]
  )

  // Índice ativo = slide cujo centro está mais perto do centro da janela de
  // rolagem. Comparar centros (e não bordas) acerta também no meio de um swipe.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    const read = () => {
      frame = 0
      const center = track.scrollLeft + track.clientWidth / 2
      let nearest = 0
      let best = Infinity
      for (let i = 0; i < track.children.length; i += 1) {
        const child = track.children[i]
        const distance = Math.abs(child.offsetLeft + child.offsetWidth / 2 - center)
        if (distance < best) {
          best = distance
          nearest = i
        }
      }
      setIndex(nearest)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    read()
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [total])

  const onKeyDown = (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    goTo(index + (event.key === 'ArrowRight' ? 1 : -1))
  }

  const atStart = index === 0
  const atEnd = index === total - 1

  return (
    <div
      role="group"
      aria-roledescription="carrossel"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`relative ${className}`}
    >
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      >
        {items.map((item, i) => (
          <div
            key={slideKey(item, i)}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${total}`}
            className="w-full shrink-0 snap-center px-0.5"
          >
            {renderSlide(item, i)}
          </div>
        ))}
      </div>

      {/* Barra de controle: setas, pontinhos e contador. Fica ABAIXO do card em
          vez de sobreposta — num card grande as setas laterais cobririam
          justamente o conteúdo que o carrossel existe para mostrar. */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CarouselButton
            direction="prev"
            disabled={atStart}
            onClick={() => goTo(index - 1)}
            label="Item anterior"
          />
          <CarouselButton
            direction="next"
            disabled={atEnd}
            onClick={() => goTo(index + 1)}
            label="Próximo item"
          />
        </div>

        <ul className="flex flex-1 flex-wrap items-center justify-center gap-1.5">
          {items.map((item, i) => (
            <li key={slideKey(item, i)}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir para o item ${i + 1}`}
                aria-current={i === index}
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-400 ease-[var(--ease-out-soft)] ${
                  i === index ? 'w-7 bg-ink' : 'w-1.5 bg-white/25 hover:bg-white/50'
                }`}
              />
            </li>
          ))}
        </ul>

        {/* aria-live: quem usa leitor de tela ouve a mudança de item ao navegar
            pelas setas, que de outro modo seriam botões sem retorno audível. */}
        <p className="shrink-0 font-display text-sm font-bold tabular-nums text-muted" aria-live="polite">
          <span className="text-ink">{String(index + 1).padStart(2, '0')}</span>
          <span className="mx-1 text-faint">/</span>
          {String(total).padStart(2, '0')}
        </p>
      </div>
    </div>
  )
}

/**
 * Seta de navegação. Exportada porque a timeline do processo (Process.jsx)
 * também é uma trilha rolável na horizontal e usa os MESMOS controles — dois
 * botões com estilos duplicados divergiriam no primeiro ajuste.
 */
export function CarouselButton({ direction, disabled, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="group grid size-10 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-ink transition-[background-color,border-color,transform,opacity] duration-300 ease-[var(--ease-out-soft)] hover:border-white/35 hover:bg-white/12 active:scale-95 disabled:pointer-events-none disabled:opacity-30 desktop:hover:scale-110"
    >
      <Icon
        name={direction === 'next' ? 'arrowRight' : 'arrowLeft'}
        size={17}
        className={`transition-transform duration-300 ease-[var(--ease-out-soft)] ${
          direction === 'next' ? 'group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5'
        }`}
      />
    </button>
  )
}
