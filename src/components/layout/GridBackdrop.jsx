/**
 * Plano de fundo global: grid ortogonal discreto (evoca blueprint/IDE) e
 * dois halos violeta assimétricos com deriva lentíssima.
 * Puramente decorativo — fora da árvore de acessibilidade e sem interação.
 */
export function GridBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Grid de 1px com máscara radial: nítido no centro, dissolvido nas bordas */}
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(255 255 255 / 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.035) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, #000 35%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, #000 35%, transparent 78%)',
        }}
      />
      {/* Halos assimétricos — nunca centralizados, nunca simétricos */}
      <div className="absolute -top-40 -left-24 size-[34rem] rounded-full bg-brand/18 blur-[130px] animate-drift" />
      <div
        className="absolute top-[28%] -right-32 size-[30rem] rounded-full bg-accent/10 blur-[140px] animate-drift"
        style={{ animationDelay: '-9s' }}
      />
      <div
        className="absolute bottom-[6%] left-[18%] size-[26rem] rounded-full bg-brand/12 blur-[150px] animate-drift"
        style={{ animationDelay: '-16s' }}
      />
      {/* Vinheta que ancora o conteúdo no escuro */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,transparent_20%,#09090b_92%)]" />
    </div>
  )
}
