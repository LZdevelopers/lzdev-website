import { useCallback, useEffect, useRef, useState } from 'react'
import { process } from '../../data/site'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { CarouselButton } from '../primitives/Carousel'
import { Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * Timeline HORIZONTAL do processo: as seis etapas numa única linha, na ordem em
 * que acontecem, com o trilho atravessando os marcadores da esquerda para a
 * direita.
 *
 * O problema de encaixar seis colunas na largura do container (1.200px) é
 * aritmético: sobram ~180px por etapa, e a descrição desce em torres de três
 * palavras por linha. A saída é dar a cada etapa uma largura CONFORTÁVEL —
 * 272px no celular, 296px a partir de sm — e deixar a linha rolar na
 * horizontal. Assim o texto respira (duas a três linhas por descrição, ~38
 * caracteres por linha) e a leitura continua sendo uma linha do tempo da
 * esquerda para a direita, não uma grade.
 *
 * A trilha estoura o padding do container (`-mx-*` com o `px-*` de volta por
 * dentro): a primeira etapa nasce alinhada ao título da seção, e as demais
 * usam a largura inteira até a borda da tela. A etapa cortada na borda direita
 * é o próprio aviso de que existe mais — reforçado pelas setas, que rolam
 * exatamente UMA etapa por clique.
 *
 * Rolagem nativa (`overflow-x` + `scroll-snap`), como nos carrosséis de
 * Projetos e Diferenciais: swipe no celular, gesto horizontal no trackpad e
 * arrasto da barra saem de graça, e as setas viram só mais um caminho para o
 * mesmo lugar. O teclado alcança a trilha (ela é focável) e as próprias setas.
 *
 * O conector não é uma barra única atrás de tudo: cada etapa desenha o seu até
 * a seguinte, então a linha começa e termina exatamente nos marcadores. Ele
 * preenche conforme a SEÇÃO passa pela tela (rolagem vertical da página), e
 * cada marcador acende ao ser alcançado — a seção demonstrando a frase que
 * promete. Nada segue o cursor.
 */

const GAPS = process.steps.length - 1

/** Quanto do conector `i` já foi preenchido (0→1), distribuído pelo scroll. */
const fillFor = (progress, i) => Math.min(Math.max(progress * GAPS - i, 0), 1)

function Step({ step, index, progress }) {
  const fill = fillFor(progress, index)
  const last = index === GAPS
  // O marcador acende um pouco antes do conector chegar nele, senão o primeiro
  // só acenderia depois de já ter saído da tela.
  const lit = progress * GAPS >= index - 0.35

  return (
    <li className="relative flex w-68 shrink-0 snap-start flex-col sm:w-74">
      {/* Conector até a etapa seguinte. Geometria: o marcador tem 3.5rem
          (size-14) e o vão entre etapas é gap-6 (1.5rem), então a linha vai da
          borda direita do marcador até o marcador seguinte —
          100% + 1.5rem − 3.5rem. */}
      {last ? null : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-7 left-14 h-px w-[calc(100%-2rem)] -translate-y-1/2 bg-white/8"
        >
          {/* Azul → ciano: o trilho preenchido é PROGRESSO, e cor faz esse
              estado ser lido de relance contra o traço apagado do que falta.
              A largura sai da utility `timeline-fill`, alimentada por --fill. */}
          <span
            className="block timeline-fill bg-gradient-to-r from-cat-1 to-cat-2"
            style={{ '--fill': fill }}
          />
        </span>
      )}

      {/* Fora do Reveal: o marcador tem de ficar exatamente sobre o trilho —
          se ele subisse com a animação de entrada, a linha descolaria dos
          marcadores durante os primeiros 700ms. */}
      <span className="mb-6 block">
        <span
          className={`relative grid size-14 place-items-center rounded-2xl border transition-[background-color,border-color,color,box-shadow] duration-500 ease-[var(--ease-out-soft)] ${
            lit
              ? 'border-brand/50 bg-brand/18 text-ink shadow-[0_0_28px_-8px_rgb(255_255_255/0.35)]'
              : 'border-white/10 bg-surface text-faint'
          }`}
        >
          <Icon name={step.icon} size={23} />
          <span
            className={`absolute -top-2 -right-2 grid size-6 place-items-center rounded-full text-[0.66rem] font-bold tabular-nums transition-colors duration-500 ${
              lit ? 'bg-brand text-bg' : 'bg-surface-2 text-faint ring-1 ring-white/10'
            }`}
          >
            {index + 1}
          </span>
        </span>
      </span>

      <Reveal delay={index * 70} className="flex flex-1 flex-col">
        <h3 className="text-[1.15rem] leading-tight text-ink">{step.title}</h3>
        <p className="mt-2.5 text-[0.925rem] leading-relaxed text-muted">{step.text}</p>

        {/* mt-auto encosta os blocos de todas as etapas na mesma linha de base,
            apesar de as descrições terem alturas diferentes. O entregável ganha
            moldura e o papel do cliente fica em texto solto: são dois níveis de
            leitura, não dois itens de uma lista. */}
        <div className="mt-auto flex flex-col items-start gap-2.5 pt-6">
          <p className="inline-flex items-start gap-2 rounded-lg border border-success/20 bg-success/[0.07] px-2.5 py-1.5 text-[0.78rem] leading-snug font-semibold text-success">
            <Icon name="check" size={14} className="mt-px shrink-0" />
            {step.deliverable}
          </p>
          <p className="flex items-start gap-2 pl-0.5 text-[0.78rem] leading-snug text-faint">
            <Icon name="userCheck" size={14} className="mt-px shrink-0" />
            {step.role}
          </p>
        </div>
      </Reveal>
    </li>
  )
}

export function Process() {
  const { ref, progress } = useScrollProgress()
  const trackRef = useRef(null)
  // `overflow`: a trilha cabe inteira na tela? Então os controles não aparecem.
  // `atStart`/`atEnd`: desabilitam a seta que não levaria a lugar nenhum.
  const [edges, setEdges] = useState({ overflow: false, atStart: true, atEnd: false })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    const read = () => {
      frame = 0
      const max = track.scrollWidth - track.clientWidth
      setEdges({
        overflow: max > 4,
        atStart: track.scrollLeft <= 2,
        atEnd: track.scrollLeft >= max - 2,
      })
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    read()
    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Uma etapa por clique. O passo sai da distância REAL entre duas etapas
  // (offsetLeft), então continua certo quando a largura muda no breakpoint.
  const nudge = useCallback((direction) => {
    const track = trackRef.current
    if (!track || track.children.length < 2) return
    const pitch = track.children[1].offsetLeft - track.children[0].offsetLeft
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({ left: direction * pitch, behavior: smooth ? 'smooth' : 'auto' })
  }, [])

  return (
    <Section id="processo">
      <SectionHeader eyebrow={process.eyebrow} title={process.title} subtitle={process.subtitle} />

      <div ref={ref} className="mt-12 sm:mt-14">
        {/* Estoura o padding do container e devolve por dentro: a etapa 1 fica
            alinhada ao cabeçalho e a trilha usa a largura toda. */}
        <div className="relative -mx-5 sm:-mx-8 xl:-mx-10">
          {/* `py-2` porque a pastilha do número sobra 8px acima do marcador:
              sem folga ela seria cortada pela trilha (com overflow-x:auto o eixo
              vertical também deixa de ser `visible`).

              `scroll-px-*` acompanhando o `px-*` é obrigatório aqui: o snap
              alinha o item ao SNAPPORT, e sem esse recuo o navegador rolava os
              20/32/40px de padding para colar a etapa 1 na borda — ela nascia
              desalinhada do título da seção e o véu da esquerda acendia sozinho,
              como se já houvesse etapa escondida atrás. */}
          <ol
            ref={trackRef}
            tabIndex={0}
            aria-label="Etapas do processo, na ordem em que acontecem"
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain px-5 py-2 scroll-px-5 sm:px-8 sm:scroll-px-8 xl:px-10 xl:scroll-px-10"
          >
            {process.steps.map((step, i) => (
              <Step key={step.title} step={step} index={i} progress={progress} />
            ))}
          </ol>

          {/* Véus laterais: a etapa cortada na borda dissolve em vez de ser
              serrada, e o lado que acabou não ganha véu — a presença do degradê
              é, ela própria, a informação de que ainda há etapa para aquele
              lado. */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-bg to-transparent transition-opacity duration-300 ${
              edges.atStart ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-bg to-transparent transition-opacity duration-300 ${
              edges.overflow && !edges.atEnd ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Controles só existem quando há etapa fora da tela */}
        {edges.overflow ? (
          <div className="mt-8 flex items-center gap-2">
            <CarouselButton
              direction="prev"
              disabled={edges.atStart}
              onClick={() => nudge(-1)}
              label="Etapa anterior"
            />
            <CarouselButton
              direction="next"
              disabled={edges.atEnd}
              onClick={() => nudge(1)}
              label="Próxima etapa"
            />
            <p className="ml-2 text-xs text-faint">Arraste para ver todas as etapas</p>
          </div>
        ) : null}
      </div>

      {/* Frase que resume a promessa da seção: organização e transparência */}
      <Reveal variant="scale" delay={100}>
        <div className="relative mt-14 overflow-hidden rounded-[var(--radius-xl2)] border border-brand/25 bg-brand/[0.07] px-6 py-9 text-center sm:px-12 border-gradient">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_140%_at_50%_0%,rgb(255_255_255/0.07),transparent_70%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-2xl">
            <span className="grid size-12 place-items-center rounded-2xl bg-success/12 text-success ring-1 ring-success/25 mx-auto">
              <Icon name="checkCircle" size={24} />
            </span>
            <p className="mt-5 font-display text-[clamp(1.25rem,3vw,1.85rem)] leading-snug font-extrabold text-ink">
              {process.highlight}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{process.highlightText}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
