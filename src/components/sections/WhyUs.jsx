import { why } from '../../data/site'
import { Carousel } from '../primitives/Carousel'
import { Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * Diferenciais em carrossel, um por vez — mesmo tratamento dos Projetos.
 *
 * Eram 7 cards numa grade de 3 colunas: três linhas de altura para textos de
 * duas linhas cada. Um por vez, cada diferencial recebe o painel de ícone, o
 * título grande e o texto inteiro em corpo legível, e a seção cabe na altura de
 * um card só.
 *
 * A cor do painel vem das categóricas (--color-cat-*), cicladas pelo índice:
 * ela não classifica nada, só marca que o item MUDOU quando o visitante avança.
 * Sem isso, sete slides de mesma composição parecem o mesmo slide travado.
 */
const TONES = ['var(--color-cat-1)', 'var(--color-cat-2)', 'var(--color-cat-3)']

function WhySlide({ item, index }) {
  return (
    <article
      style={{ '--cat': TONES[index % TONES.length] }}
      className="group grid gap-6 overflow-hidden rounded-[var(--radius-xl2)] border border-white/8 bg-surface/40 p-5 border-gradient sm:p-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-9 lg:p-8"
    >
      {/* Painel do ícone: a única superfície colorida do slide, o que mantém a
          cor como acento e não como fundo da seção. Altura FIXA no desktop —
          quadrado, o painel esticava o card a ~520px para acomodar textos de
          três linhas, e sobrava um vazio enorme ao lado. */}
      <div
        className="relative grid aspect-16/10 place-items-center overflow-hidden rounded-[1rem] border border-[color-mix(in_oklab,var(--cat)_25%,transparent)] lg:aspect-auto lg:h-60"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, color-mix(in oklab, var(--cat) 22%, transparent), transparent 68%)',
        }}
      >
        <span
          aria-hidden="true"
          className="font-display absolute top-4 left-5 text-[3.5rem] leading-none font-extrabold text-white/[0.06] tabular-nums"
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="relative grid size-20 place-items-center rounded-3xl bg-[color-mix(in_oklab,var(--cat)_16%,transparent)] text-[var(--cat)] ring-1 ring-[color-mix(in_oklab,var(--cat)_35%,transparent)] transition-transform duration-500 ease-[var(--ease-out-soft)] desktop:group-hover:scale-110">
          <Icon name={item.icon} size={38} strokeWidth={1.4} />
        </span>
      </div>

      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">Diferencial</p>
        <h3 className="mt-2 text-[clamp(1.45rem,3.2vw,2rem)] text-ink">{item.title}</h3>
        <p className="mt-4 text-[0.98rem] leading-relaxed text-muted sm:text-[1.02rem]">{item.text}</p>
      </div>
    </article>
  )
}

export function WhyUs() {
  return (
    <Section id="diferenciais">
      <SectionHeader eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle} align="left" />

      <Reveal variant="scale" className="mt-12 block">
        <Carousel
          items={why.items}
          label="Diferenciais da LZdev"
          slideKey={(item) => item.title}
          renderSlide={(item, index) => <WhySlide item={item} index={index} />}
        />
      </Reveal>
    </Section>
  )
}
