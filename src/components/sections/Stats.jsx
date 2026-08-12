import { stats } from '../../data/site'
import { Counter } from '../primitives/Counter'
import { Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * Métrica em tile próprio: ícone, número e rótulo.
 *
 * O tile ganha contorno e fundo, em vez de números soltos sobre o painel —
 * cada métrica passa a ser lida como uma unidade, e o hover destaca uma sem
 * apagar as outras. O número anima de 0 até o valor ao entrar no viewport
 * (`Counter` / `useCountUp`).
 */
function StatTile({ item }) {
  return (
    <div className="group flex h-full w-full flex-col items-center gap-3 rounded-[var(--radius-card)] border border-white/8 bg-white/[0.02] px-4 py-7 text-center transition-[border-color,background-color,transform] duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-brand/35 hover:bg-white/[0.045]">
      <span className="grid size-11 place-items-center rounded-xl bg-info/12 text-info ring-1 ring-info/25 transition-[color,transform] duration-400 ease-[var(--ease-out-soft)] desktop:group-hover:scale-110">
        <Icon name={item.icon} size={20} />
      </span>

      <p className="font-display text-[clamp(2.1rem,5vw,2.75rem)] leading-none font-extrabold text-gradient tabular-nums">
        <Counter value={item.value} prefix={item.prefix} suffix={item.suffix} />
      </p>

      <p className="text-sm font-bold text-ink">{item.label}</p>
      <p className="mx-auto max-w-52 text-xs leading-relaxed text-muted">{item.text}</p>
    </div>
  )
}

export function Stats() {
  return (
    <Section id="numeros" tight>
      <div className="relative overflow-hidden rounded-[var(--radius-xl2)] border border-white/8 bg-surface/40 px-5 py-12 sm:px-8 sm:py-14 border-gradient">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_120%_at_50%_0%,rgb(255_255_255/0.06),transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative">
          <SectionHeader eyebrow={stats.eyebrow} title={stats.title} subtitle={stats.subtitle} />

          {/* 5 métricas. Larguras fixas com flex-wrap centralizado deixam a
              última linha centrada e do mesmo tamanho — num grid de 3 colunas
              ela ficaria encostada à esquerda com um buraco à direita. */}
          <ul className="mt-12 flex flex-wrap justify-center gap-3.5">
            {stats.items.map((item, i) => (
              <Reveal
                as="li"
                key={item.label}
                delay={i * 90}
                className="flex w-[calc(50%-0.4375rem)] sm:w-[calc(33.333%-0.5834rem)] lg:w-[calc(20%-0.7rem)]"
              >
                <StatTile item={item} />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
