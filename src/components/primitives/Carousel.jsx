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
 * posição de rolagem (num rAF), então os pontinhos, o índice e o contador
 * acompanham qualquer uma dessas formas.
 *
 * TRÊS CAMADAS DIZEM QUE EXISTE MAIS COISA AO LADO — o problema de um carrossel
 * é o visitante não perceber que há um segundo item:
 *
 *   1 · PRÉVIA · a partir de sm o slide não ocupa a largura toda, então uma
 *       faixa do card seguinte fica sempre à vista. É o sinal mais forte de
 *       todos, porque é o próprio conteúdo aparecendo. Os slides fora do foco
 *       ficam esmaecidos: assim a faixa lateral é lida como "o próximo item", e
 *       não como um card cortado por engano.
 *   2 · ÍNDICE NOMEADO · acima da trilha, os títulos de TODOS os itens. Quem
 *       chega vê a lista inteira sem rolar nada, sabe quantos são e pula direto
 *       para o que interessa. É o que responde "o que tem aqui?" de relance.
 *   3 · CONVITE · enquanto ninguém tocou no carrossel, a seta "próximo" recebe
 *       destaque e um empurrãozinho de 3px, ao lado de uma frase curta. Na
 *       primeira interação — clique, tecla, swipe ou arrasto — os dois somem:
 *       a dica cumpriu a função e não fica piscando para sempre.
 *
 * Teclado: ← e → navegam quando o foco está dentro do carrossel; o conteúdo de
 * cada slide continua tabulável na ordem natural.
 *
 * @param {object} props
 * @param {Array} props.items
 * @param {string} props.label Nome do carrossel para leitor de tela.
 * @param {(item: any, i: number) => React.ReactNode} props.renderSlide
 * @param {(item: any, i: number) => string} props.slideKey
 * @param {string} [props.hint] Frase do convite a rolar.
 */
export function Carousel({
  items,
  label,
  renderSlide,
  slideKey,
  hint = 'Arraste para o lado ou use as setas',
  className = '',
}) {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  // Só o PRIMEIRO contato importa: é ele que apaga o convite. Depois disso o
  // visitante já sabe que a trilha rola, e insistir viraria ruído.
  const [interacted, setInteracted] = useState(false)
  const total = items.length

  const goTo = useCallback(
    (target) => {
      const track = trackRef.current
      if (!track) return
      const slide = track.children[Math.max(0, Math.min(target, total - 1))]
      if (!slide) return
      setInteracted(true)
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      // Alvo CENTRALIZADO, não a borda esquerda do slide: com a prévia lateral o
      // slide é mais estreito que a trilha, e mandar a borda para o zero deixaria
      // o navegador corrigindo a posição depois do scroll (o card chega e dá um
      // pulinho). A conta é a mesma que o `snap-center` faria.
      const centered = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2
      track.scrollTo({ left: Math.max(0, centered), behavior: smooth ? 'smooth' : 'auto' })
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
      // Swipe e arrasto da barra não passam por `goTo`, e são interação como
      // qualquer outra — o convite tem de sumir neles também.
      setInteracted(true)
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
            /* A largura menor que 100% (a partir de sm) é o que deixa a faixa
               do card seguinte à vista. `snap-center` cuida do resto: o
               navegador centraliza o slide e recorta os vizinhos sozinho. */
            className={`w-full shrink-0 snap-center px-0.5 transition-opacity duration-500 ease-[var(--ease-out-soft)] sm:w-[calc(100%-3rem)] sm:px-1.5 lg:w-[calc(100%-4rem)] ${
              i === index ? 'opacity-100' : 'opacity-100 sm:opacity-45'
            }`}
          >
            {renderSlide(item, i)}
          </div>
        ))}
      </div>

      {/* Barra de controle: setas, convite/pontinhos e contador. Fica ABAIXO do
          card em vez de sobreposta — num card grande as setas laterais cobririam
          justamente o conteúdo que o carrossel existe para mostrar. */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex shrink-0 items-center gap-2">
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
            /* O destaque extra existe até o primeiro contato e some junto com a
               frase — depois disso as duas setas voltam a pesar igual. */
            emphasis={!interacted && !atEnd}
          />
        </div>

        {/* Convite (desktop) e pontinhos (celular) ocupam o MESMO vão, então a
            barra tem a mesma altura nos dois casos. O convite continua no lugar
            depois de sumir (só a opacidade cai): nada salta na tela. */}
        {hint ? (
          <p
            aria-hidden="true"
            className={`pointer-events-none hidden flex-1 items-center gap-2 text-xs text-faint transition-opacity duration-500 sm:flex ${
              interacted ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Icon name="arrowRight" size={13} className="shrink-0 animate-nudge-x" />
            {hint}
          </p>
        ) : (
          <span className="hidden flex-1 sm:block" />
        )}

        {/* Pontinhos do celular. O TRAÇO continua com 6px de altura, mas a área
            clicável é o botão inteiro: 28px de altura com o padding, porque um
            alvo de 6px é impossível de acertar com o dedo (o mínimo confortável
            da WCAG é 24px) e errar aqui significa não ver o resto da lista. */}
        <ul className="flex flex-1 flex-wrap items-center justify-center gap-0.5 sm:hidden">
          {items.map((item, i) => (
            <li key={slideKey(item, i)}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir para o item ${i + 1} de ${total}`}
                aria-current={i === index}
                className="group grid h-7 place-items-center px-2.5"
              >
                <span
                  aria-hidden="true"
                  className={`block h-1.5 rounded-full transition-[width,background-color] duration-400 ease-[var(--ease-out-soft)] ${
                    i === index ? 'w-7 bg-ink' : 'w-1.5 bg-white/25 group-hover:bg-white/50'
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>

        {/* O contador "01 / 04" saiu da tela, mas o ANÚNCIO ficou: sem ele, as
            setas viram dois botões sem nenhum retorno audível para quem navega
            por leitor de tela. Agora a mesma informação existe só para quem
            precisa dela, em `sr-only` com `aria-live`. */}
        <p className="sr-only" aria-live="polite">
          Item {index + 1} de {total}
        </p>
      </div>
    </div>
  )
}

/* O ÍNDICE NOMEADO foi removido daqui.
 *
 * Era uma fileira de pastilhas acima da trilha — "01 Sprint Max",
 * "02 Kimori Korean Food", "03 Horário de Brasília"… —, uma por item, com o
 * número de ordem em destaque. A intenção era boa (mostrar o que existe fora da
 * tela antes de rolar), mas o resultado eram duas listas do mesmo conteúdo na
 * mesma seção, e a numeração dava a entender que os projetos seguem uma ordem
 * que eles não seguem.
 *
 * O que continua dizendo que há mais coisa ao lado: a PRÉVIA do card seguinte
 * (o slide não ocupa a largura toda a partir de sm), as SETAS, os PONTINHOS no
 * celular e a FRASE de convite. Quatro sinais, nenhum deles numerado.
 */

/**
 * Seta de navegação do carrossel.
 *
 * O botão é a 44px (o alvo mínimo confortável para o dedo), com borda e fundo
 * mais claros que o padrão dos controles secundários do site: numa página em que
 * a rolagem lateral é a única forma de ver o resto do conteúdo, a seta não pode
 * ser o elemento mais discreto da seção. `emphasis` sobe um degrau — halo
 * externo e a seta com o empurrãozinho — e é usado só na direção que leva ao
 * conteúdo ainda não visto, enquanto o visitante não interagiu.
 */
function CarouselButton({ direction, disabled, onClick, label, emphasis = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`group grid size-11 place-items-center rounded-full border text-ink transition-[background-color,border-color,box-shadow,transform,opacity] duration-300 ease-[var(--ease-out-soft)] hover:border-brand/50 hover:bg-white/14 active:scale-95 disabled:pointer-events-none disabled:opacity-25 desktop:hover:scale-110 ${
        emphasis
          ? 'border-white/40 bg-white/12 shadow-[0_0_0_4px_rgb(255_255_255/0.05)]'
          : 'border-white/20 bg-white/[0.06]'
      }`}
    >
      <Icon
        name={direction === 'next' ? 'arrowRight' : 'arrowLeft'}
        size={18}
        className={`transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:animate-none ${
          direction === 'next' ? 'group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5'
        } ${emphasis ? 'animate-nudge-x' : ''}`}
      />
    </button>
  )
}
