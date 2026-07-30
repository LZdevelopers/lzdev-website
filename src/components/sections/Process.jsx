import { process } from '../../data/site'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * Timeline horizontal do processo.
 *
 * Layout: 6 colunas a partir de `lg`, com o trilho atravessando os marcadores;
 * abaixo disso a mesma lista vira uma timeline vertical, porque seis colunas em
 * tela de celular reduziriam o texto a duas palavras por linha.
 *
 * O trilho não é uma barra única atrás de tudo: cada etapa desenha o seu próprio
 * conector até a seguinte. Assim a linha começa e termina exatamente nos
 * marcadores, sem sobra na borda, em qualquer largura de coluna.
 *
 * Conforme a seção passa pela tela, o trilho preenche e cada marcador acende ao
 * ser alcançado — é a própria seção demonstrando a frase que ela promete. Tudo
 * ligado ao progresso de rolagem; nada segue o cursor.
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
    <li className="relative flex flex-col pl-16 lg:pl-0">
      {/* Conector até a etapa seguinte: vertical no mobile (do pé do marcador ao
          topo do próximo), horizontal a partir de lg. */}
      {last ? null : (
        <span
          aria-hidden="true"
          /* Geometria: o marcador tem 3.25rem (size-13). No mobile o conector
             sai do pé dele e vai até o topo do próximo — 100% + gap-11 (2.75rem)
             − 3.25rem. No desktop sai da borda direita até o próximo marcador —
             100% + gap-6 (1.5rem) − 3.25rem. */
          className="pointer-events-none absolute top-13 left-6.5 h-[calc(100%-0.5rem)] w-px -translate-x-1/2 bg-white/8 lg:top-6.5 lg:left-13 lg:h-px lg:w-[calc(100%-1.75rem)] lg:translate-x-0 lg:-translate-y-1/2"
        >
          {/* O eixo do preenchimento muda com o breakpoint, então quem resolve
              altura/largura é a utility `timeline-fill` — um transform não dá
              para trocar de eixo inline. */}
          <span
            className="block timeline-fill bg-gradient-to-b from-brand to-accent lg:bg-gradient-to-r"
            style={{ '--fill': fill }}
          />
        </span>
      )}

      {/* Marcador — absoluto no mobile, no topo da coluna a partir de lg */}
      <span className="absolute top-0 left-0 lg:static lg:mb-7 lg:block">
        <span
          className={`relative grid size-13 place-items-center rounded-2xl border transition-[background-color,border-color,color,box-shadow] duration-500 ease-[var(--ease-out-soft)] ${
            lit
              ? 'border-brand/50 bg-brand/18 text-ink shadow-[0_0_28px_-8px_rgb(124_58_237/0.85)]'
              : 'border-white/10 bg-surface text-faint'
          }`}
        >
          <Icon name={step.icon} size={21} />
          <span
            className={`absolute -top-2 -right-2 grid size-5.5 place-items-center rounded-full text-[0.62rem] font-bold tabular-nums transition-colors duration-500 ${
              lit ? 'bg-brand text-white' : 'bg-surface-2 text-faint ring-1 ring-white/10'
            }`}
          >
            {index + 1}
          </span>
        </span>
      </span>

      <Reveal delay={index * 80} className="flex flex-1 flex-col">
        <h3 className="text-lg font-bold text-ink lg:text-[1.05rem]">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>

        {/* mt-auto no invólucro encosta os blocos de todas as etapas na mesma
            linha de base, apesar de as descrições terem alturas diferentes. */}
        <div className="mt-auto flex flex-col gap-2 pt-4">
          <p className="flex items-start gap-1.5 text-xs leading-snug font-semibold text-accent">
            <Icon name="check" size={13} className="mt-px shrink-0" />
            {step.deliverable}
          </p>
          <p className="flex items-start gap-1.5 text-xs leading-snug text-faint">
            <Icon name="userCheck" size={13} className="mt-px shrink-0" />
            {step.role}
          </p>
        </div>
      </Reveal>
    </li>
  )
}

export function Process() {
  const { ref, progress } = useScrollProgress()

  return (
    <Section id="processo">
      <SectionHeader eyebrow={process.eyebrow} title={process.title} subtitle={process.subtitle} />

      <div ref={ref} className="mt-16">
        <ol className="flex flex-col gap-11 lg:grid lg:grid-cols-6 lg:gap-6">
          {process.steps.map((step, i) => (
            <Step key={step.title} step={step} index={i} progress={progress} />
          ))}
        </ol>
      </div>

      {/* Frase que resume a promessa da seção: organização e transparência */}
      <Reveal variant="scale" delay={100}>
        <div className="relative mt-16 overflow-hidden rounded-[var(--radius-xl2)] border border-brand/25 bg-brand/[0.07] px-6 py-10 text-center sm:px-12 border-gradient">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_140%_at_50%_0%,rgb(124_58_237/0.16),transparent_70%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-2xl">
            <span className="grid size-12 place-items-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/25 mx-auto">
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
