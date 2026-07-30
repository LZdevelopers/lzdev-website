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
 */

/** Anéis concêntricos da plataforma — desenhados em SVG para controle do traço. */
function Platform() {
  return (
    <div className="hero-platform" aria-hidden="true">
      <div className="hero-platform-floor" />
      <div className="hero-platform-core" />

      <svg className="hero-platform-rings" viewBox="0 0 400 140" fill="none">
        <defs>
          <linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0" />
            <stop offset="22%" stopColor="#a78bfa" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#ede9fe" stopOpacity="1" />
            <stop offset="78%" stopColor="#60a5fa" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hero-ring-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
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

export function HeroStage() {
  return (
    <div className="hero-stage-outer">
      <div className="hero-stage">
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
            <span className="hero-card-icon" data-tone={card.tone} aria-hidden="true">
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
