import { Fragment } from 'react'
import { hero } from '../../data/site'
import { Button } from '../primitives/Button'
import { Reveal } from '../primitives/Reveal'
import { HeroBackdrop } from './hero/HeroBackdrop'
import { HeroStage } from './hero/HeroStage'

/**
 * Hero de abertura: ~100vh, texto à esquerda e dashboard 3D à direita.
 * A composição visual (fundo, palco, plataforma) vive em ./hero/*, e todo o
 * estilo em src/styles/hero.css — nenhuma classe escapa da seção.
 */

/**
 * Renderiza uma linha de tokens aplicando o gradiente onde `accent` existir.
 * O espaço entre tokens é inserido aqui (e só quando falta), então o conteúdo
 * em site.js fica livre de espaços de significado tipográfico.
 */
function Tokens({ tokens, accentClass, useTone = false }) {
  return tokens.map((token, i) => {
    const glued = i === 0 || /\s$/.test(tokens[i - 1].text) || /^\s/.test(token.text)

    return (
      <Fragment key={i}>
        {glued ? null : ' '}
        {token.accent ? (
          <span className={accentClass} data-tone={useTone ? token.accent : undefined}>
            {token.text}
          </span>
        ) : (
          token.text
        )}
      </Fragment>
    )
  })
}

export function Hero() {
  return (
    <section id="inicio" className="hero">
      <HeroBackdrop />

      <div className="hero-inner container-page">
        <div className="hero-grid">
          {/* — coluna de texto — */}
          <div className="hero-copy">
            <Reveal delay={90}>
              <h1 className="hero-title">
                {hero.title.map((line, i) => (
                  <span className="hero-title-line" key={i}>
                    <Tokens tokens={line} accentClass="hero-title-accent" useTone />
                  </span>
                ))}
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="hero-lead">{hero.subtitle}</p>
            </Reveal>

            <Reveal delay={260}>
              <div className="hero-actions">
                <Button href="#contato" size="xl" variant="gradient" icon="arrowUpRight" iconBadge>
                  {hero.primaryCta}
                </Button>
                <Button href="#projetos" size="xl" variant="outline" icon="arrowDown">
                  {hero.secondaryCta}
                </Button>
              </div>
            </Reveal>

          </div>

          {/* — coluna do palco — */}
          <Reveal variant="scale" delay={200}>
            <HeroStage />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
