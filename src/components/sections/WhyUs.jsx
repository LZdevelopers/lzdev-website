import { why } from '../../data/site'
import { Card } from '../primitives/Card'
import { Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

export function WhyUs() {
  // São 7 diferenciais. O primeiro vira um cartão horizontal em largura total
  // (âncora da seção) e os 6 restantes fecham exatamente 2 linhas de 3 colunas
  // — nenhum card órfão esticado na última linha.
  const [lead, ...others] = why.items

  return (
    <Section id="diferenciais">
      <SectionHeader eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle} align="left" />

      <div className="mt-14 flex flex-col gap-3.5">
        <Reveal>
          <Card innerClassName="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-7 sm:p-8">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand/12 text-brand-soft ring-1 ring-brand/25 transition-colors duration-500 group-hover:text-accent">
              <Icon name={lead.icon} size={26} />
            </span>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-ink sm:text-2xl">{lead.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{lead.text}</p>
            </div>

            <p className="flex shrink-0 items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-accent uppercase ring-1 ring-accent/22">
              <Icon name="sparkles" size={14} />
              Ponto de partida
            </p>
          </Card>
        </Reveal>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((item, i) => (
            <Reveal key={item.title} delay={(i + 1) * 55} className="h-full">
              <Card className="h-full" innerClassName="flex h-full flex-col gap-3 p-5 sm:p-6">
                <span className="text-brand-soft transition-colors duration-500 group-hover:text-accent">
                  <Icon name={item.icon} size={22} />
                </span>
                <h3 className="text-base font-bold text-ink">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{item.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
