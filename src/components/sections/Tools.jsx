import { tools } from '../../data/site'
import { brandColors, Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * Ferramentas agrupadas por camada (front-end · back-end e dados · design).
 * O agrupamento é o que dá a leitura: a stack cobre o projeto de ponta a ponta.
 *
 * Cada tecnologia é identificada pela COR OFICIAL dela — o laranja do HTML, o
 * ciano do React, o amarelo do JavaScript. É o único lugar da página onde a cor
 * não é semântica nem de marca própria: um dev reconhece a stack varrendo os
 * ícones, sem ler um nome sequer, e isso só funciona com as cores certas. O hex
 * vem de `brandColors` (Icon.jsx), junto da geometria — não duplicado aqui.
 *
 * A cor entra na variável `--tool` e daí tinge tile, anel e halo por
 * `color-mix`, então não existe uma classe do Tailwind por tecnologia. No hover
 * (ou no foco por teclado) as três misturas ficam mais fortes, o ícone cresce
 * e o card sobe 4px.
 *
 * O card é horizontal (ícone à esquerda, texto à direita) em vez de empilhado:
 * assim a altura passa a ser a do bloco de texto, e não "tile + texto". Cada
 * card encurta cerca de um terço sem cortar uma palavra da descrição — é o que
 * comprime a seção, junto com o respiro menor entre os grupos.
 */
function ToolCard({ tool }) {
  return (
    <div
      tabIndex={0}
      style={{ '--tool': brandColors[tool.icon] }}
      className="group relative flex h-full w-full items-start gap-3.5 overflow-hidden rounded-[var(--radius-card)] border border-white/8 bg-surface/40 p-4 transition-[border-color,background-color,transform] duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--tool)_45%,transparent)] hover:bg-surface/70 focus-visible:-translate-y-1"
    >
      {/* Halo na cor da tecnologia — posição fixa, só a opacidade cresce */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-400 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background:
            'radial-gradient(130% 85% at 50% 0%, color-mix(in oklab, var(--tool) 20%, transparent), transparent 68%)',
        }}
      />

      <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--tool)_12%,transparent)] ring-1 ring-[color-mix(in_oklab,var(--tool)_28%,transparent)] transition-[background-color,box-shadow,transform] duration-400 group-hover:bg-[color-mix(in_oklab,var(--tool)_22%,transparent)] group-hover:ring-[color-mix(in_oklab,var(--tool)_50%,transparent)] group-focus-visible:ring-[color-mix(in_oklab,var(--tool)_50%,transparent)] desktop:group-hover:scale-110">
        <Icon name={tool.icon} size={22} colored />
      </span>

      <div className="relative min-w-0">
        <h3 className="text-[0.95rem] leading-tight font-bold text-ink">{tool.name}</h3>
        <p className="mt-1.5 text-[0.8rem] leading-snug text-muted">{tool.text}</p>
      </div>
    </div>
  )
}

export function Tools() {
  return (
    <Section id="ferramentas">
      <SectionHeader eyebrow={tools.eyebrow} title={tools.title} subtitle={tools.subtitle} />

      <div className="mt-10 flex flex-col gap-7 sm:mt-12">
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
            <ul className="mt-4 flex flex-wrap justify-center gap-3.5">
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
        <p className="mx-auto mt-10 max-w-2xl rounded-[var(--radius-card)] border border-dashed border-brand/30 bg-brand/[0.05] px-5 py-4 text-center text-sm leading-relaxed text-muted">
          {tools.note}
        </p>
      </Reveal>
    </Section>
  )
}
