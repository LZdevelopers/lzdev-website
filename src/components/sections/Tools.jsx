import { tools } from '../../data/site'
import { brandColors, Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * Ferramentas agrupadas por camada (front-end · back-end e dados · design).
 * O agrupamento é o que dá a leitura: a stack cobre o projeto de ponta a ponta.
 *
 * DOIS PESOS por grupo, e é o que mantém a seção lendo como argumento em vez de
 * mural de logos (ver o comentário de `tools.groups` em data/site.js):
 *
 *   CARD    · quatro por grupo, com descrição. Quatro é a largura do grid, então
 *             cada grupo fecha em uma linha exata no desktop — nenhuma fileira
 *             quebrada, nenhum buraco à direita, e os três grupos com o mesmo
 *             peso visual. Antes o front-end tinha SETE cards (HTML, CSS e
 *             JavaScript entre eles) contra três do último grupo: a seção pendia
 *             toda para o começo, e três cards explicavam o que não precisa de
 *             explicação.
 *   PASTILHA · a base que acompanha qualquer projeto, em ícone e nome. Continua
 *             na página — tirar seria esconder parte do trabalho —, só sem o
 *             espaço de quem decide a arquitetura.
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
 * assim a altura passa a ser a do bloco de texto, e não "tile + texto".
 */
/* O card NÃO é focável. Ele tinha `tabIndex={0}` só para acender o realce de
   hover no teclado, e o preço disso eram 12 paradas de tabulação em elementos
   que não fazem nada quando acionados — quem navega por teclado atravessava a
   seção inteira apertando Tab sem nunca chegar a um controle. Numa lista de
   texto, o realce é enfeite; a parada de foco é obstáculo. */
function ToolCard({ tool }) {
  return (
    <div
      style={{ '--tool': brandColors[tool.icon] || 'var(--color-brand-soft)' }}
      className="group relative flex h-full w-full items-start gap-3 overflow-hidden rounded-[var(--radius-card)] border border-white/8 bg-surface/40 p-3.5 transition-[border-color,background-color,transform] duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--tool)_45%,transparent)] hover:bg-surface/70"
    >
      {/* Halo na cor da tecnologia — posição fixa, só a opacidade cresce */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(130% 85% at 50% 0%, color-mix(in oklab, var(--tool) 20%, transparent), transparent 68%)',
        }}
      />

      <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--tool)_12%,transparent)] ring-1 ring-[color-mix(in_oklab,var(--tool)_28%,transparent)] transition-[background-color,box-shadow,transform] duration-400 group-hover:bg-[color-mix(in_oklab,var(--tool)_22%,transparent)] group-hover:ring-[color-mix(in_oklab,var(--tool)_50%,transparent)] desktop:group-hover:scale-110">
        <Icon name={tool.icon} size={20} colored />
      </span>

      <div className="relative min-w-0">
        {/* h4, não h3: o h3 é o rótulo do GRUPO (Front-end, Back-end e dados) e
            estas tecnologias estão dentro dele. Dois h3 no mesmo nível faziam a
            estrutura mentir sobre quem contém quem. */}
        <h4 className="text-[0.9rem] leading-tight font-bold text-ink">{tool.name}</h4>
        <p className="mt-1 text-[0.78rem] leading-snug text-muted">{tool.text}</p>
      </div>
    </div>
  )
}

/**
 * Pastilha da base: logo colorido e nome, sem descrição. O contorno é mais
 * apagado que o do card de propósito — é a mesma família visual dos chips de
 * stack dos projetos, e a diferença de peso entre as duas formas é justamente a
 * informação ("isto vem junto" contra "isto foi escolhido").
 */
function ToolChip({ tool }) {
  return (
    <li
      style={{ '--tool': brandColors[tool.icon] || 'var(--color-brand-soft)' }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.02] px-2.5 py-1.5 text-[0.75rem] font-medium text-muted transition-[border-color,color] duration-300 hover:border-[color-mix(in_oklab,var(--tool)_38%,transparent)] hover:text-ink"
    >
      <Icon name={tool.icon} size={14} colored />
      {tool.name}
    </li>
  )
}

export function Tools() {
  return (
    // `tight` porque esta é a seção de apoio da jornada: ela prova que existe
    // critério técnico e passa a bola para a próxima. Não precisa do respiro
    // vertical das seções que argumentam.
    <Section id="tecnologias" tight>
      <SectionHeader eyebrow={tools.eyebrow} title={tools.title} subtitle={tools.subtitle} />

      <div className="mt-8 flex flex-col gap-6 sm:mt-10">
        {tools.groups.map((group, g) => (
          <div key={group.label}>
            {/* Cabeçalho do grupo: rótulo + legenda e uma régua que ocupa o
                espaço restante. A partir de sm os dois textos dividem UMA linha,
                para que três cabeçalhos não custem a altura de um card; no
                celular a legenda desce para a segunda linha em vez de
                desaparecer — a informação continua lá, só reorganizada. */}
            <Reveal delay={g * 60}>
              <div className="flex items-center gap-3">
                <div className="flex shrink-0 flex-col sm:flex-row sm:items-baseline sm:gap-2.5">
                  <h3 className="text-[0.72rem] font-bold tracking-[0.14em] text-ink uppercase">
                    {group.label}
                  </h3>
                  <p className="text-[0.78rem] text-faint">{group.caption}</p>
                </div>
                {/* A régua só entra quando o cabeçalho é uma linha: com o rótulo
                    e a legenda empilhados no celular, ela cruzaria a altura do
                    texto e pareceria um risco sobre a legenda. */}
                <span
                  aria-hidden="true"
                  className="hidden h-px flex-1 bg-gradient-to-r from-white/12 to-transparent sm:block"
                />
              </div>
            </Reveal>

            {/* Quatro por grupo = uma linha cheia no desktop, duas no tablet.
                Grid de verdade (e não flex-wrap com largura fixa) porque agora
                não existe linha incompleta para centralizar. */}
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {group.items.map((tool, i) => (
                <Reveal as="li" key={tool.name} delay={g * 60 + i * 45} className="flex">
                  <ToolCard tool={tool} />
                </Reveal>
              ))}
            </ul>

            {group.extras?.length ? (
              <Reveal delay={g * 60 + 180}>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-faint uppercase">
                    {group.extrasLabel}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {group.extras.map((tool) => (
                      <ToolChip key={tool.name} tool={tool} />
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  )
}
