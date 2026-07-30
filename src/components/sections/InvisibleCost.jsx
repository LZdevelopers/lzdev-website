import { invisibleCost } from '../../data/site'
import { Button } from '../primitives/Button'
import { Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * Cartão de prejuízo. O tom de alerta (warn) é usado só aqui — é a única
 * seção da página que fala de perda, e o vermelho carrega esse peso sem
 * precisar de nenhum recurso de movimento.
 */
function CostCard({ item, className = '' }) {
  return (
    <article
      className={`group relative flex h-full flex-col gap-4 overflow-hidden rounded-[var(--radius-card)] border border-warn/18 bg-warn/[0.035] p-6 transition-[border-color,background-color,transform] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-warn/40 hover:bg-warn/[0.07] sm:p-7 ${className}`}
    >
      {/* Brasa no canto superior — estática, só a opacidade cresce no hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-warn/12 opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <span className="relative grid size-12 shrink-0 place-items-center rounded-xl bg-warn/10 text-warn ring-1 ring-warn/22">
        <Icon name={item.icon} size={22} />
      </span>

      <h3 className="relative text-lg leading-snug font-bold text-ink">{item.title}</h3>
      <p className="relative text-sm leading-relaxed text-muted">{item.text}</p>

      <p className="relative mt-auto flex items-center gap-2 border-t border-warn/12 pt-4 text-sm font-semibold text-warn">
        <Icon name="trendingDown" size={16} className="shrink-0" />
        {item.consequence}
      </p>
    </article>
  )
}

export function InvisibleCost() {
  const [first, second, ...rest] = invisibleCost.items

  return (
    <Section id="custo-invisivel">
      <SectionHeader
        eyebrow={invisibleCost.eyebrow}
        title={invisibleCost.title}
        subtitle={invisibleCost.subtitle}
      />

      {/* Dois cartões maiores puxam a atenção; os três restantes fecham a
          composição numa linha de apoio, evitando um mosaico monótono. */}
      <div className="mt-14 grid gap-4 lg:grid-cols-2">
        {[first, second].map((item, i) => (
          <Reveal key={item.title} delay={i * 100} className="h-full">
            <CostCard item={item} />
          </Reveal>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {rest.map((item, i) => (
          <Reveal key={item.title} delay={200 + i * 100} className="h-full">
            <CostCard item={item} />
          </Reveal>
        ))}
      </div>

      {/* Virada de tom: fecha a seção olhando para a solução, não para a dor */}
      <Reveal variant="scale" delay={120}>
        <div className="mt-8 flex flex-col items-center gap-6 rounded-[var(--radius-xl2)] border border-brand/25 bg-brand/[0.07] px-6 py-9 text-center sm:px-10 border-gradient">
          <div className="max-w-2xl">
            <h3 className="text-[clamp(1.35rem,3vw,1.85rem)] text-ink">{invisibleCost.closing.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted">{invisibleCost.closing.text}</p>
          </div>
          <Button href="#contato" size="lg" icon="arrowRight">
            {invisibleCost.closing.cta}
          </Button>
        </div>
      </Reveal>
    </Section>
  )
}
