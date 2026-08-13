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
 *
 * A seção cresceu de 10 para 14 tecnologias sem crescer em altura: o card perdeu
 * padding e o tile encolheu de 40 para 36px, o cabeçalho de grupo virou uma
 * linha só (a pastilha com a contagem saiu — a informação já está nos cards) e o
 * respiro entre grupos caiu de 28 para 20px.
 *
 * `--tool` cai no grafite de apoio quando a tecnologia não tem logo de marca
 * (Composer): sem isso, as misturas do tile ficariam sem cor nenhuma e só aquele
 * card apareceria sem fundo nem anel.
 */
function ToolCard({ tool }) {
  return (
    <div
      tabIndex={0}
      style={{ '--tool': brandColors[tool.icon] || 'var(--color-brand-soft)' }}
      className="group relative flex h-full w-full items-start gap-3 overflow-hidden rounded-[var(--radius-card)] border border-white/8 bg-surface/40 p-3.5 transition-[border-color,background-color,transform] duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--tool)_45%,transparent)] hover:bg-surface/70 focus-visible:-translate-y-1"
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

      <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--tool)_12%,transparent)] ring-1 ring-[color-mix(in_oklab,var(--tool)_28%,transparent)] transition-[background-color,box-shadow,transform] duration-400 group-hover:bg-[color-mix(in_oklab,var(--tool)_22%,transparent)] group-hover:ring-[color-mix(in_oklab,var(--tool)_50%,transparent)] group-focus-visible:ring-[color-mix(in_oklab,var(--tool)_50%,transparent)] desktop:group-hover:scale-110">
        <Icon name={tool.icon} size={20} colored />
      </span>

      <div className="relative min-w-0">
        <h3 className="text-[0.9rem] leading-tight font-bold text-ink">{tool.name}</h3>
        <p className="mt-1 text-[0.78rem] leading-snug text-muted">{tool.text}</p>
      </div>
    </div>
  )
}

export function Tools() {
  return (
    // `tight` porque esta é a seção de apoio da jornada: ela prova que existe
    // critério técnico e passa a bola para a próxima. Não precisa do respiro
    // vertical das seções que argumentam.
    <Section id="ferramentas" tight>
      <SectionHeader eyebrow={tools.eyebrow} title={tools.title} subtitle={tools.subtitle} />

      <div className="mt-8 flex flex-col gap-5 sm:mt-10">
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

            {/* Os grupos têm 7, 4 e 3 itens. Num grid de 4 colunas as linhas
                incompletas deixariam um buraco à direita; com flex-wrap de
                largura fixa e centralizado, elas ficam centradas mantendo a
                MESMA largura de card dos outros grupos. */}
            <ul className="mt-3 flex flex-wrap justify-center gap-3">
              {group.items.map((tool, i) => (
                <Reveal
                  as="li"
                  key={tool.name}
                  delay={g * 60 + i * 45}
                  className="flex w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(25%-0.5625rem)]"
                >
                  <ToolCard tool={tool} />
                </Reveal>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
