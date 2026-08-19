import { hero } from '../../../data/site'
import { Icon } from '../../primitives/Icon'
import { Logo } from '../../layout/Logo'
import { HeroDashboard } from './HeroDashboard'

/**
 * Palco do lado direito: dashboard inclinado em 3D, cards flutuantes,
 * plataforma holográfica e órbitas.
 *
 * A ordem de pintura é controlada por z-index em hero.css:
 * órbitas/plataforma (1) → painel (2) → cards flutuantes (3).
 *
 * O palco também é a área sensível ao ponteiro: é ele que escreve o desvio de
 * inclinação do painel (ver trackTilt abaixo). O painel em si tem interação
 * própria — trilha lateral e gráfico —, que mora em HeroDashboard.jsx.
 */

/** Anéis concêntricos da plataforma — desenhados em SVG para controle do traço. */
function Platform() {
  return (
    <div className="hero-platform" aria-hidden="true">
      <div className="hero-platform-floor" />
      <div className="hero-platform-core" />

      <svg className="hero-platform-rings" viewBox="0 0 400 140" fill="none">
        <defs>
          {/* O anel já nascia claro no centro (#ede9fe) e sumia nas pontas: o
              desenho era de LUZ, não de matiz, então em branco puro ele é o
              mesmo traço — só perdeu o violeta e o ciano das extremidades. */}
          <linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="22%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="78%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hero-ring-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="200" cy="72" rx="150" ry="42" fill="url(#hero-ring-fill)" />
        <ellipse cx="200" cy="72" rx="190" ry="52" stroke="url(#hero-ring)" strokeWidth="1" opacity="0.75" />
        <ellipse cx="200" cy="72" rx="140" ry="38" stroke="url(#hero-ring)" strokeWidth="1.2" opacity="0.9" />
        <ellipse cx="200" cy="72" rx="92" ry="25" stroke="url(#hero-ring)" strokeWidth="1.4" />
        <ellipse cx="200" cy="72" rx="46" ry="12" stroke="url(#hero-ring)" strokeWidth="1" opacity="0.8" />
      </svg>
    </div>
  )
}

/**
 * O PALCO SEGUE O CURSOR.
 *
 * Enquanto o mouse anda sobre o palco, estas duas variáveis são somadas à
 * inclinação base do painel (ver .hero-panel-wrap em hero.css) — o mockup gira
 * alguns graus em direção ao ponteiro e volta sozinho quando ele sai. É o que
 * transforma uma ilustração 3D parada em algo que responde a quem chegou.
 *
 * Custo por evento: um `getBoundingClientRect` e duas custom properties. Nenhum
 * estado do React, nenhum re-render, nenhum recálculo de layout — só uma matriz
 * de transformação que o compositor já ia calcular de qualquer jeito.
 *
 * Amplitude curta de propósito (±5,5° na horizontal, ±3° na vertical): o painel
 * tem texto pequeno lá dentro, e girar demais o deixa ilegível justamente
 * quando o visitante está tentando olhar.
 *
 * `mouse` exclui dedo e caneta: em toque a inclinação ficaria travada no último
 * ponto tocado, o que não é resposta a nada.
 */
const trackTilt = (event) => {
  if (event.pointerType !== 'mouse') return

  const rect = event.currentTarget.getBoundingClientRect()
  const style = event.currentTarget.style
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5

  style.setProperty('--hero-pointer-x', `${(x * 11).toFixed(2)}deg`)
  style.setProperty('--hero-pointer-y', `${(-y * 6).toFixed(2)}deg`)
}

/** Ponteiro fora do palco: as variáveis somem e o painel volta à pose base. */
const releaseTilt = (event) => {
  event.currentTarget.style.removeProperty('--hero-pointer-x')
  event.currentTarget.style.removeProperty('--hero-pointer-y')
}

export function HeroStage() {
  return (
    <div className="hero-stage-outer">
      <div className="hero-stage" onPointerMove={trackTilt} onPointerLeave={releaseTilt}>
        {/* Pontos de luz que percorrem as elipses da plataforma */}
        <div className="hero-orbit hero-orbit--wide" aria-hidden="true">
          <span className="hero-orbit-dot" />
        </div>
        <div className="hero-orbit hero-orbit--tight" aria-hidden="true">
          <span className="hero-orbit-dot" />
        </div>

        <Platform />

        {/* Marca projetada pela plataforma, atrás do painel */}
        <Logo className="hero-watermark" showWordmark={false} size={132} />

        <div className="hero-panel-wrap">
          <div className="hero-panel-float">
            <HeroDashboard />
          </div>
        </div>

        {hero.floatingCards.map((card) => (
          <article className={`hero-card hero-card--${card.at}`} key={card.title}>
            <span className="hero-card-icon" aria-hidden="true">
              <Icon name={card.icon} size="52%" strokeWidth={1.8} />
            </span>
            <div>
              <strong>{card.title}</strong>
              <p>{card.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
