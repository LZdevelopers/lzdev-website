import { primaryCta, services } from '../../data/site'
import { Button } from '../primitives/Button'
import { Card } from '../primitives/Card'
import { Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * SERVIÇOS — a seção que respondia a pergunta que a página não respondia.
 *
 * Antes dela, o visitante passava por projetos, stack, dor, diferenciais,
 * equipe e números sem nunca ler O QUE SE CONTRATA aqui: ele tinha que deduzir
 * o serviço a partir dos exemplos. Pior, o <title> e os dados estruturados
 * anunciavam SaaS, automações e APIs que seção nenhuma sustentava.
 *
 * O card é feito para ser lido em três segundos, na ordem em que a decisão
 * acontece: o QUE é (título), PARA QUEM é, o que VEM junto e — sem obrigar
 * ninguém a caçar no FAQ — QUANTO custa e em QUANTO TEMPO fica pronto. Preço e
 * prazo são a informação que mais faz alguém desistir de procurar, e por isso
 * ficam no pé do card, na única linha com contorno próprio.
 *
 * A cor categórica cicla como no carrossel de diferenciais: ela não classifica
 * nada, só separa os três cards de relance. Nenhum tom novo entra na página.
 */
const TONES = ['var(--color-cat-1)', 'var(--color-cat-2)', 'var(--color-cat-3)']

const CARD_INNER = 'flex h-full flex-col p-5 sm:p-6'

function ServiceCard({ service, index }) {
  return (
    <Card
      as="article"
      className="h-full"
      innerClassName={CARD_INNER}
      style={{ '--cat': TONES[index % TONES.length] }}
    >
      <span
        className="grid size-11 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--cat)_14%,transparent)] text-[var(--cat)] ring-1 ring-[color-mix(in_oklab,var(--cat)_32%,transparent)] transition-transform duration-400 ease-[var(--ease-out-soft)] desktop:group-hover:scale-110"
        aria-hidden="true"
      >
        <Icon name={service.icon} size={22} strokeWidth={1.6} />
      </span>

      <h3 className="mt-4 text-[1.25rem] leading-tight text-ink">{service.name}</h3>
      <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{service.what}</p>

      {/* Para quem é. Fica logo abaixo do que é, porque a pergunta seguinte de
          quem lê um serviço é sempre "isso é para o meu caso?". */}
      <p className="mt-4 flex items-start gap-2 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5 text-[0.8rem] leading-snug text-ink">
        <Icon name="userCheck" size={14} className="mt-0.5 shrink-0 text-[var(--cat)]" aria-hidden="true" />
        {service.audience}
      </p>

      <ul className="mt-4 flex flex-col gap-2">
        {service.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[0.85rem] leading-snug text-muted">
            <Icon name="check" size={14} className="mt-0.5 shrink-0 text-[var(--cat)]" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      {/* Preço e prazo: `mt-auto` cola a faixa no pé do card, então os três
          cards alinham essa linha mesmo com listas de alturas diferentes. */}
      <div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-white/8 pt-4 sm:pt-5">
        <p className="font-display text-[0.95rem] font-bold text-ink">{service.price}</p>
        <p className="flex items-center gap-1.5 text-[0.75rem] text-faint">
          <Icon name="clock" size={13} className="shrink-0" aria-hidden="true" />
          {service.timeline}
        </p>
      </div>
    </Card>
  )
}

export function Services() {
  return (
    <Section id="servicos">
      <SectionHeader eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle} />

      <ul className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-3">
        {services.items.map((service, i) => (
          <Reveal as="li" key={service.name} delay={i * 110} className="flex">
            <ServiceCard service={service} index={i} />
          </Reveal>
        ))}
      </ul>

      {/* Fechamento com UM botão. Três cards com três botões idênticos seriam
          três CTAs disputando o mesmo clique — aqui o botão é um só, e o link
          de texto ao lado pesa visivelmente menos que ele. */}
      <Reveal delay={120}>
        <div className="mt-6 flex flex-col gap-5 rounded-[var(--radius-xl2)] border border-white/8 bg-surface/40 px-5 py-6 border-gradient sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <p className="text-[0.95rem] leading-relaxed text-ink">{services.closing.text}</p>
            <p className="mt-2 flex items-center gap-2 text-[0.8rem] text-faint">
              <Icon name="map" size={14} className="shrink-0" aria-hidden="true" />
              {services.closing.note}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href="#contato" variant="outline" size="lg" icon="arrowRight">
              {primaryCta}
            </Button>
            <a
              href="#projetos"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors duration-300 hover:text-ink"
            >
              Ver projetos entregues
              <Icon
                name="arrowDown"
                size={15}
                className="shrink-0 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
