import { Button } from '../primitives/Button'
import { Logo } from '../layout/Logo'

/** Tela usada quando uma hospedagem entrega o app para uma URL inexistente. */
export function NotFound() {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-bg px-5 py-8 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.035)_1px,transparent_1px),radial-gradient(ellipse_120%_80%_at_50%_-10%,rgb(255_255_255/0.06),transparent_60%)] [background-size:72px_72px,72px_72px,100%_100%]"
      />

      <div className="relative flex w-full max-w-xl flex-col items-center">
        <a href="/" aria-label="LZdev — voltar ao início" className="rounded-lg">
          <Logo compact />
        </a>

        <p
          aria-hidden="true"
          className="mt-10 translate-x-[0.025em] bg-[linear-gradient(100deg,#fff_8%,#d4d4d4_48%,#8f8f8f_96%)] bg-clip-text font-display text-[clamp(3.5rem,16vw,5.5rem)] leading-none font-extrabold tracking-[-0.05em] text-transparent"
        >
          404
        </p>
        <h1 className="mt-3 text-[clamp(1.5rem,5.5vw,2.1rem)] leading-tight font-extrabold tracking-[-0.03em] text-ink">
          Ops! Essa página não existe.
        </h1>
        <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted">
          O endereço pode ter mudado ou estar incompleto. Você pode voltar à página inicial e continuar por lá.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="primary" size="lg">
            Voltar para a página inicial
          </Button>
          <Button href="/contato" variant="outline" size="lg">
            Falar com a nossa equipe
          </Button>
        </div>
      </div>
    </main>
  )
}
