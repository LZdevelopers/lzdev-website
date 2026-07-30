import { useState } from 'react'
import { faq } from '../../data/site'
import { Button } from '../primitives/Button'
import { Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * Acordeão acessível: um item aberto por vez, controlado por botão com
 * aria-expanded/aria-controls. A altura anima via grid-template-rows,
 * então não precisa medir o conteúdo em JS.
 */
export function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader eyebrow={faq.eyebrow} title={faq.title} align="left" />

          <Reveal delay={200}>
            <div className="mt-8 rounded-[var(--radius-card)] border border-white/8 bg-surface/45 p-6">
              <p className="text-sm leading-relaxed text-muted">{faq.helper.text}</p>
              <Button href="#contato" variant="outline" className="mt-5" icon="arrowRight">
                {faq.helper.cta}
              </Button>
            </div>
          </Reveal>
        </div>

        <ul className="flex flex-col gap-3">
          {faq.items.map((item, i) => {
            const open = openIndex === i
            return (
              <Reveal as="li" key={item.q} delay={i * 55}>
                <div
                  className={`overflow-hidden rounded-[var(--radius-card)] border bg-surface/40 transition-[border-color,background-color] duration-400 ${
                    open ? 'border-brand/35 bg-brand/[0.05]' : 'border-white/8 hover:border-white/18'
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? -1 : i)}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-trigger-${i}`}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="text-[0.98rem] font-semibold text-ink sm:text-base">{item.q}</span>
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-lg border transition-[transform,border-color,background-color,color] duration-400 ease-[var(--ease-out-soft)] ${
                          open
                            ? 'rotate-180 border-brand/45 bg-brand/18 text-ink'
                            : 'border-white/10 bg-white/[0.03] text-muted'
                        }`}
                        aria-hidden="true"
                      >
                        <Icon name="chevronDown" size={16} />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    className={`grid transition-[grid-template-rows] duration-450 ease-[var(--ease-out-soft)] ${
                      open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6 sm:pb-6">{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
