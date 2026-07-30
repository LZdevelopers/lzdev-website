import { Reveal } from './Reveal'

/** Ponto pulsante ciano + rótulo — elemento de repetição que costura o site. */
function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
      <span className="size-1.5 rounded-full bg-accent animate-pulse-dot" aria-hidden="true" />
      {children}
    </span>
  )
}

/**
 * Casca padrão de seção: ritmo vertical, largura máxima e id para âncora.
 * `tight` reduz o respiro quando duas seções precisam parecer conectadas.
 */
export function Section({ id, className = '', tight = false, children, ...rest }) {
  return (
    <section
      id={id}
      className={`relative ${tight ? 'py-14 sm:py-20' : 'py-20 sm:py-28 lg:py-32'} ${className}`}
      {...rest}
    >
      <div className="container-page">{children}</div>
    </section>
  )
}

/** Cabeçalho de seção: eyebrow + título + subtítulo, com reveal em cascata. */
export function SectionHeader({ eyebrow, title, subtitle, align = 'center', className = '' }) {
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
        <h2 className="text-[clamp(1.85rem,4.6vw,3.05rem)] text-ink">{title}</h2>
      </Reveal>
      {subtitle ? (
        <Reveal delay={160}>
          <p className="text-base sm:text-lg leading-relaxed text-muted">{subtitle}</p>
        </Reveal>
      ) : null}
    </header>
  )
}
