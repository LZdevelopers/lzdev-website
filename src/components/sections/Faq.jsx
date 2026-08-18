import { useState } from 'react'
import { faq } from '../../data/site'
import { Button } from '../primitives/Button'
import { Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * Recuo do conteúdo da resposta: alinha com o texto da pergunta, não com a borda
 * do card. Agora é só o padding lateral (5/6) — a coluna do número, que a conta
 * antiga somava, deixou de existir (ver o comentário do botão abaixo).
 */
const ANSWER_INSET = 'px-5 sm:px-6'

/**
 * Acordeão acessível: um item aberto por vez, controlado por botão com
 * aria-expanded/aria-controls. A altura anima via grid-template-rows,
 * então não precisa medir o conteúdo em JS.
 */
export function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader title={faq.title} align="left" />

          <Reveal delay={200}>
            <div className="mt-8 flex gap-4 rounded-[var(--radius-card)] border border-white/8 bg-surface/45 p-6">
              <span
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/20 text-ink ring-1 ring-brand/30"
                aria-hidden="true"
              >
                <Icon name="chat" size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-sm leading-relaxed text-muted">{faq.helper.text}</p>
                <Button href="#contato" variant="outline" className="mt-5" icon="arrowRight">
                  {faq.helper.cta}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        <ul className="flex flex-col gap-3">
          {faq.items.map((item, i) => {
            const open = openIndex === i
            return (
              <Reveal as="li" key={item.q} delay={i * 55}>
                <div
                  className={`relative overflow-hidden rounded-[var(--radius-card)] border bg-surface/40 transition-[border-color,background-color] duration-400 ${
                    open ? 'border-brand/35 bg-brand/[0.05]' : 'border-white/8 hover:border-white/18'
                  }`}
                >
                  {/* Barra de acento do item aberto: ciano→azul, as mesmas
                      categóricas dos diferenciais, marcando "este é o ativo". */}
                  <span
                    className={`absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-cat-2 to-cat-1 transition-opacity duration-400 ${
                      open ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-hidden="true"
                  />

                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? -1 : i)}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-trigger-${i}`}
                      className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                    >
                      {/* A NUMERAÇÃO "01 02 03…" saía aqui, à esquerda de cada
                          pergunta. Um FAQ não tem ordem de execução: numerar
                          sugere etapa onde só existe assunto, e era a mesma
                          numeração decorativa que aparecia no menu do celular e
                          nos carrosséis — o padrão repetido três vezes na mesma
                          página. */}
                      <span className="flex-1 text-[0.98rem] font-semibold text-ink sm:text-base">{item.q}</span>
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-lg border transition-[transform,border-color,background-color,color] duration-400 ease-[var(--ease-out-soft)] ${
                          open
                            ? 'rotate-180 border-brand/45 bg-brand/25 text-ink'
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
                      <div className={`${ANSWER_INSET} pb-5 sm:pb-6`}>
                        <p className="text-sm leading-relaxed text-muted">{item.a}</p>
                        {item.tag ? (
                          <span className="mt-4 inline-flex rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-muted uppercase">
                            {item.tag}
                          </span>
                        ) : null}
                      </div>
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
