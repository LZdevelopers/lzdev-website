import { tools } from '../../data/site'
import { Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * Ferramentas agrupadas por camada (front-end · back-end e dados · design).
 * O agrupamento é o que dá a leitura: a stack cobre o projeto de ponta a ponta.
 *
 * Em repouso o grid é monocromático e silencioso. No hover — ou no foco por
 * teclado — o ícone assume a cor da marca, o tile se acende e o card sobe 4px.
 * Nada acompanha o cursor: são transições de cor e transform disparadas apenas
 * pelo estado de hover/foco.
 */
function ToolCard({ tool }) {
  return (
    <div
      tabIndex={0}
      className="group relative flex h-full w-full flex-col gap-4 overflow-hidden rounded-[var(--radius-card)] border border-white/8 bg-surface/40 p-5 transition-[border-color,background-color,transform] duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--tool)_40%,transparent)] hover:bg-surface/70 focus-visible:-translate-y-1"
      style={{ '--tool': tool.color }}
    >
      {/* Halo na cor da marca — posição fixa, só a opacidade cresce */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-400 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background:
            'radial-gradient(130% 85% at 50% 0%, color-mix(in oklab, var(--tool) 15%, transparent), transparent 68%)',
        }}
      />

      <div className="relative flex items-center gap-3.5">
        {/* Tile, ícone e anel puxam a cor de --tool, então não existe uma
            classe do Tailwind por tecnologia — só a variável no card. */}
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-muted ring-1 ring-white/8 transition-[color,background-color,box-shadow] duration-400 group-hover:bg-[color-mix(in_oklab,var(--tool)_14%,transparent)] group-hover:text-[var(--tool)] group-hover:ring-[color-mix(in_oklab,var(--tool)_32%,transparent)] group-focus-visible:bg-[color-mix(in_oklab,var(--tool)_14%,transparent)] group-focus-visible:text-[var(--tool)]">
          <Icon name={tool.icon} size={26} />
        </span>
        <h3 className="text-base font-bold text-ink">{tool.name}</h3>
      </div>

      <p className="relative text-sm leading-relaxed text-muted">{tool.text}</p>
    </div>
  )
}

export function Tools() {
  return (
    <Section id="ferramentas">
      <SectionHeader eyebrow={tools.eyebrow} title={tools.title} subtitle={tools.subtitle} />

      <div className="mt-14 flex flex-col gap-10">
        {tools.groups.map((group, g) => (
          <div key={group.label}>
            {/* Cabeçalho do grupo: rótulo + régua que ocupa o espaço restante */}
            <Reveal delay={g * 60}>
              <div className="flex items-center gap-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-sm font-bold tracking-[0.12em] text-ink uppercase">{group.label}</h3>
                  <p className="text-sm text-faint">{group.caption}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-gradient-to-r from-white/12 to-transparent"
                />
                <span className="shrink-0 rounded-full bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-faint tabular-nums ring-1 ring-white/8">
                  {group.items.length}
                </span>
              </div>
            </Reveal>

            {/* Os grupos têm 4, 4 e 2 itens. Num grid de 4 colunas o último
                deixaria metade da linha vazia; com flex-wrap de largura fixa e
                centralizado, ele fica centrado mantendo a MESMA largura de card
                dos outros grupos. */}
            <ul className="mt-5 flex flex-wrap justify-center gap-3.5">
              {group.items.map((tool, i) => (
                <Reveal
                  as="li"
                  key={tool.name}
                  delay={g * 60 + i * 55}
                  className="flex w-full sm:w-[calc(50%-0.4375rem)] lg:w-[calc(25%-0.65625rem)]"
                >
                  <ToolCard tool={tool} />
                </Reveal>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mx-auto mt-12 max-w-2xl rounded-[var(--radius-card)] border border-dashed border-brand/30 bg-brand/[0.05] p-5 text-center text-sm leading-relaxed text-muted">
          {tools.note}
        </p>
      </Reveal>
    </Section>
  )
}
