import { Icon } from '../primitives/Icon'

/**
 * Vitrine do card de projeto.
 *
 * Quando `image` está preenchido em data/site.js, mostra a captura real. Sem
 * imagem, desenha o mockup correspondente em CSS/SVG: nitidez em qualquer tela,
 * sem peso de rede e sem espaço vazio enquanto os screenshots não existem.
 */

const barHeights = [46, 68, 54, 82, 71, 94]

function DashboardPreview() {
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex gap-2">
        {['Vendas', 'Estoque', 'Usuários'].map((label, i) => (
          <div key={label} className="flex-1 rounded-lg border border-white/8 bg-white/[0.03] p-2">
            <p className="text-[0.55rem] text-faint uppercase">{label}</p>
            <p className="mt-0.5 font-display text-[0.8rem] font-extrabold text-ink">
              {['R$ 84k', '1.204', '312'][i]}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-1 items-end gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] p-3">
        {barHeights.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-brand/30 to-brand transition-[height] duration-700 ease-[var(--ease-out-soft)]"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="space-y-1">
        {[80, 62, 71].map((w, i) => (
          <div key={i} className="flex items-center gap-2 rounded-md bg-white/[0.03] px-2 py-1.5">
            <span className="size-1.5 rounded-full bg-accent/70" />
            <span className="h-1.5 rounded-full bg-white/12" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function RestaurantPreview() {
  return (
    <div className="flex h-full flex-col gap-2.5 p-4">
      <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
        <span className="font-display text-[0.72rem] font-extrabold tracking-wide text-ink">KIMORI</span>
        <span className="flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-0.5 w-3 rounded-full bg-white/25" />
          ))}
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden rounded-lg bg-gradient-to-br from-orange-500/25 via-rose-500/15 to-brand/20">
        <div className="absolute inset-0 grid place-items-center">
          <span className="rounded-full bg-black/35 px-3 py-1.5 text-[0.6rem] font-bold tracking-wide text-white/90 uppercase backdrop-blur-sm">
            Cardápio
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-white/8 bg-white/[0.03] p-1.5">
            <div className="h-6 rounded bg-gradient-to-br from-amber-400/25 to-rose-500/20" />
            <span className="mt-1 block h-1 w-3/4 rounded-full bg-white/15" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ClockPreview() {
  return (
    <div className="grid h-full place-items-center p-4">
      <div className="text-center">
        <p className="font-display text-[2rem] leading-none font-extrabold tracking-tight text-ink tabular-nums sm:text-[2.4rem]">
          14<span className="text-accent">:</span>32
        </p>
        <p className="mt-1.5 text-[0.6rem] font-semibold tracking-[0.2em] text-faint uppercase">
          Horário de Brasília
        </p>
        <div className="mx-auto mt-3 flex w-fit items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 ring-1 ring-emerald-400/25">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
          <span className="text-[0.58rem] font-semibold text-emerald-300">sincronizado</span>
        </div>
      </div>
    </div>
  )
}

function PortfolioPreview() {
  return (
    <div className="flex h-full flex-col gap-2.5 p-4">
      <div className="flex-1 rounded-lg border border-white/8 bg-white/[0.03] p-3">
        <span className="block h-2 w-16 rounded-full bg-accent/60" />
        <span className="mt-2 block h-3 w-full rounded-full bg-white/15" />
        <span className="mt-1.5 block h-3 w-4/5 rounded-full bg-white/10" />
        <div className="mt-3 flex gap-1.5">
          <span className="h-4 w-14 rounded-md bg-brand/50" />
          <span className="h-4 w-14 rounded-md bg-white/10" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[0, 1].map((i) => (
          <div key={i} className="h-10 rounded-lg border border-white/8 bg-gradient-to-br from-brand/18 to-accent/10" />
        ))}
      </div>
    </div>
  )
}

const PREVIEWS = {
  dashboard: DashboardPreview,
  restaurant: RestaurantPreview,
  clock: ClockPreview,
  portfolio: PortfolioPreview,
}

export function ProjectPreview({ kind, image, name }) {
  const Preview = PREVIEWS[kind]

  if (image) {
    return (
      <div className="relative aspect-16/10 overflow-hidden rounded-[1rem] border border-white/8 bg-[#0a0d15]">
        <img
          src={image}
          alt={`Interface do projeto ${name}`}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-bg/25 transition-opacity duration-500 group-hover:opacity-0"
          aria-hidden="true"
        />
      </div>
    )
  }

  return (
    <div className="relative aspect-16/10 overflow-hidden rounded-[1rem] border border-white/8 bg-[#0a0d15]">
      {/* Barra de janela */}
      <div className="flex items-center gap-1.5 border-b border-white/8 bg-white/[0.02] px-3 py-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 rounded-full bg-white/15" />
        ))}
        <span className="ml-2 h-1.5 flex-1 rounded-full bg-white/6" />
      </div>

      <div className="h-[calc(100%-1.9rem)]">
        {Preview ? (
          <Preview />
        ) : (
          <div className="grid h-full place-items-center text-faint">
            <Icon name="globe" size={28} />
          </div>
        )}
      </div>

      {/* Véu que clareia no hover do card pai */}
      <div
        className="pointer-events-none absolute inset-0 bg-bg/25 transition-opacity duration-500 group-hover:opacity-0"
        aria-hidden="true"
      />
    </div>
  )
}
