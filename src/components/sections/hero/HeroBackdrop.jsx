/**
 * Fundo decorativo do Hero: halos radiais, arcos orbitais em SVG, partículas
 * de luz e vinheta. Totalmente fora da árvore de acessibilidade e sem
 * interação — o `.hero-bg` fica em z-index -1 dentro da própria seção, então
 * não interfere no GridBackdrop global.
 */

// Partículas: posição em % da seção + atraso da cintilação (evita sincronia)
const SPARKS = [
  { top: '18%', left: '62%', delay: '-0.4s' },
  { top: '26%', left: '88%', delay: '-2.1s', sm: true },
  { top: '44%', left: '54%', delay: '-1.3s', sm: true },
  { top: '58%', left: '95%', delay: '-3.2s' },
  { top: '70%', left: '46%', delay: '-2.6s', sm: true },
  { top: '12%', left: '38%', delay: '-1.8s', sm: true },
  { top: '80%', left: '72%', delay: '-0.9s' },
]

export function HeroBackdrop() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <div className="hero-halo hero-halo--main" />
      <div className="hero-halo hero-halo--cyan" />
      <div className="hero-halo hero-halo--violet" />

      {/* Arcos que contornam o dashboard e convergem para a plataforma */}
      <svg className="hero-arcs" viewBox="0 0 600 640" fill="none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="hero-arc-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0" />
            <stop offset="38%" stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="72%" stopColor="#60a5fa" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-arc-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="45%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d="M18 330C34 148 214 26 396 52 546 74 604 200 588 346" stroke="url(#hero-arc-a)" strokeWidth="1.1" />
        <path
          d="M74 402C86 220 234 96 400 118 528 136 586 244 572 372"
          stroke="url(#hero-arc-b)"
          strokeWidth="1"
          opacity="0.7"
        />
        <path
          d="M6 470C74 566 216 616 366 606"
          stroke="url(#hero-arc-a)"
          strokeWidth="1.2"
          strokeDasharray="1.5 8"
          opacity="0.65"
        />
        <path
          d="M560 470C520 560 430 612 320 620"
          stroke="url(#hero-arc-b)"
          strokeWidth="1.2"
          strokeDasharray="1.5 8"
          opacity="0.5"
        />

        {/* Brilhos nas interseções dos arcos */}
        <circle cx="396" cy="52" r="2.6" fill="#ede9fe" opacity="0.95" />
        <circle cx="588" cy="346" r="2.2" fill="#a5f3fc" opacity="0.8" />
        <circle cx="74" cy="402" r="2" fill="#c4b5fd" opacity="0.75" />
        <circle cx="366" cy="606" r="2.2" fill="#bfdbfe" opacity="0.7" />
      </svg>

      {SPARKS.map((spark) => (
        <span
          key={`${spark.top}-${spark.left}`}
          className={`hero-spark${spark.sm ? ' hero-spark--sm' : ''}`}
          style={{ top: spark.top, left: spark.left, animationDelay: spark.delay }}
        />
      ))}

      <div className="hero-vignette" />
    </div>
  )
}
