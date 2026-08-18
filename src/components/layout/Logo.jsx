/**
 * Marca da LZdev: símbolo + wordmark.
 *
 * O símbolo é derivado de public/logo.png por `npm run icons` — o original tem
 * canvas 3:2 com ~300px de vazio de cada lado, e usá-lo direto é o que deixava
 * a marca distorcida em qualquer slot quadrado. O derivado é quadrado de fato.
 *
 * Sem `size`, o símbolo escala por breakpoint: na navbar e no rodapé do desktop
 * sobra espaço, e a marca precisa ocupá-lo. Com `size` (número), fica travado
 * em px — é o que a marca d'água do Hero usa.
 *
 * Um único arquivo de 256px atende os três usos (navbar, rodapé, marca d'água
 * de 132px): resolução de sobra até 2x em todos, e uma requisição só.
 *
 * `compact` é um passo abaixo na escala, usado só no header — lá a marca divide
 * uma barra de 72px com o menu e o CTA. No rodapé ela respira e fica no passo
 * cheio, então símbolo e wordmark descem juntos para o lockup não desproporcionar.
 */
const MARK = '/logo-mark-256.png'

/** Lado do arquivo em pixels — a proporção que os atributos width/height fixam. */
const MARK_PX = 256

const MARK_SIZE = {
  compact: 'size-9 sm:size-10 lg:size-11', // 36 · 40 · 44
  full: 'size-10 sm:size-11 lg:size-12', //   40 · 44 · 48
}

const WORDMARK_SIZE = {
  compact: 'text-[1.3rem] sm:text-[1.45rem] lg:text-[1.55rem]',
  full: 'text-[1.4rem] sm:text-[1.55rem] lg:text-[1.7rem]',
}

export function Logo({ className = '', showWordmark = true, size, compact = false }) {
  const fixed = typeof size === 'number'
  const step = compact ? 'compact' : 'full'

  return (
    <span className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* alt vazio de propósito: na navbar e no rodapé quem nomeia a marca é o
          wordmark ao lado (texto de verdade), e no Hero o símbolo é decorativo. */}
      {/* width/height SEMPRE presentes, mesmo quando a classe é que dá o
          tamanho: o par de atributos é o que reserva a proporção antes de a
          imagem chegar, e é ele que impede o layout de pular (CLS) no primeiro
          carregamento. Com `size`, os atributos são o tamanho final; sem ele,
          valem como proporção 1:1 e o CSS decide os pixels. */}
      <img
        src={MARK}
        alt=""
        width={fixed ? size : MARK_PX}
        height={fixed ? size : MARK_PX}
        decoding="async"
        className={`shrink-0 ${fixed ? '' : MARK_SIZE[step]}`}
      />

      {showWordmark ? (
        <span
          className={`font-display leading-none font-extrabold tracking-[-0.035em] text-ink ${WORDMARK_SIZE[step]}`}
        >
          LZ<span className="text-accent">dev</span>
        </span>
      ) : null}
    </span>
  )
}
