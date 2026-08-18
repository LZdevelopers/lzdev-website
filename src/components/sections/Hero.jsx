import { Fragment } from 'react'
import { hero, primaryCta } from '../../data/site'
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
 *
 * Os tokens já carregaram um tom por matiz ('violeta' | 'azul' | 'ciano'), que
 * escolhia entre três gradientes. Na paleta preta e branca o destaque tem um
 * tratamento só — branco pleno contra o cinza-claro da frase —, então `accent`
 * voltou a ser um booleano.
 */
function Tokens({ tokens, accentClass }) {
  return tokens.map((token, i) => {
    const glued = i === 0 || /\s$/.test(tokens[i - 1].text) || /^\s/.test(token.text)

    return (
      <Fragment key={i}>
        {glued ? null : ' '}
        {token.accent ? <span className={accentClass}>{token.text}</span> : token.text}
      </Fragment>
    )
  })
}

export function Hero() {
  return (
    /* aria-labelledby aponta para o H1: é o que dá NOME à região de abertura.
       O Hero não usa o primitivo <Section> (ele tem composição própria), então a
       ligação é feita à mão aqui. */
    <section id="inicio" className="hero" aria-labelledby="inicio-titulo">
      <HeroBackdrop />

      <div className="hero-inner container-page">
        <div className="hero-grid">
          {/* — coluna de texto — */}
          <div className="hero-copy">
            <Reveal delay={90}>
              <h1 id="inicio-titulo" className="hero-title">
                {hero.title.map((line, i) => (
                  <span className="hero-title-line" key={i}>
                    <Tokens tokens={line} accentClass="hero-title-accent" />
                    {/* Espaço no fim de cada linha: as linhas são blocos, então
                        ele não muda nada na tela (espaço no fim de linha é
                        descartado na renderização), mas é o que separa as
                        palavras quando alguém lê o TEXTO do H1 em vez do
                        desenho — rastreador simples, leitor de tela antigo,
                        resumo de resultado de busca. Sem ele o título vira
                        "Desenvolvemossites e sistemas websob medida". */}
                    {' '}
                  </span>
                ))}
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="hero-lead">{hero.subtitle}</p>
            </Reveal>

            <Reveal delay={260}>
              <div className="hero-actions">
                {/* O CTA principal da PÁGINA. É o único botão com a placa em
                    gradiente e o único com o ícone em cápsula: dois recursos que
                    não se repetem em nenhum outro botão do site, justamente para
                    que este seja lido como "o" caminho. O secundário fica em
                    contorno, no mesmo tamanho — quem não está pronto para pedir
                    orçamento tem para onde ir sem competir pelo olho. */}
                <Button href="#contato" size="xl" variant="gradient" icon="arrowUpRight" iconBadge>
                  {primaryCta}
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
