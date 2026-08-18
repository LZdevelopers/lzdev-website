import { createContext, useContext } from 'react'
import { Reveal } from './Reveal'

/**
 * Ponto pulsante + rótulo — elemento de repetição que costura o site.
 * O ponto é a única cor fixa do cabeçalho de seção: um azul pequeno que se
 * repete do topo ao rodapé e impede que a sequência de títulos brancos vire
 * uma parede monocromática.
 */
function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
      <span className="size-1.5 rounded-full bg-info pulse-dot" aria-hidden="true" />
      {children}
    </span>
  )
}

/**
 * Id do <h2> de uma seção, derivado do id da própria seção.
 * Existe para que `aria-labelledby` e o `id` do título saiam da MESMA conta:
 * escrever a string nos dois lugares é o jeito garantido de um dia mudar um e
 * esquecer o outro — e um `aria-labelledby` apontando para nada é pior que
 * nenhum, porque a seção passa a ser uma região sem nome.
 */
export const headingId = (sectionId) => `${sectionId}-titulo`

/** O id da seção atual, para o SectionHeader nomear o título sem receber prop. */
const SectionIdContext = createContext(null)

/**
 * Casca padrão de seção: ritmo vertical, largura máxima e id para âncora.
 * `tight` reduz o respiro quando duas seções precisam parecer conectadas.
 *
 * `aria-labelledby` aponta para o <h2> do cabeçalho: é o que transforma cada
 * <section> numa REGIÃO NOMEADA. Sem nome, um <section> não é landmark nenhum
 * para o leitor de tela — quem navega por regiões ouviria "seção, seção,
 * seção"; com ele, ouve "Serviços", "Projetos", "Equipe" e pula direto.
 */
export function Section({ id, className = '', tight = false, children, ...rest }) {
  return (
    <SectionIdContext value={id}>
      <section
        id={id}
        aria-labelledby={id ? headingId(id) : undefined}
        className={`relative ${tight ? 'py-12 sm:py-16' : 'py-16 sm:py-20 lg:py-24'} ${className}`}
        {...rest}
      >
        <div className="container-page">{children}</div>
      </section>
    </SectionIdContext>
  )
}

/**
 * Cabeçalho de seção: eyebrow + título + subtítulo, com reveal em cascata.
 *
 * O <h2> recebe o id derivado da seção que o contém (via contexto), então ele é
 * o nome acessível daquela região sem ninguém precisar passar nada.
 */
export function SectionHeader({ eyebrow, title, subtitle, align = 'center', className = '' }) {
  const sectionId = useContext(SectionIdContext)
  const centered = align === 'center'

  return (
    <header
      className={`flex flex-col gap-5 ${centered ? 'items-center text-center mx-auto max-w-3xl' : 'items-start text-left max-w-3xl'} ${className}`}
    >
      {eyebrow ? (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}
      <Reveal delay={80}>
        <h2 id={sectionId ? headingId(sectionId) : undefined} className="text-[clamp(1.85rem,4.6vw,3.05rem)] text-ink">
          {title}
        </h2>
      </Reveal>
      {subtitle ? (
        <Reveal delay={160}>
          <p className="text-base sm:text-lg leading-relaxed text-muted">{subtitle}</p>
        </Reveal>
      ) : null}
    </header>
  )
}
