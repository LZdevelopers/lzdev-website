import { useCountUp } from '../../hooks/useCountUp'

/**
 * Número que conta de 0 até `value` ao entrar no viewport.
 * A animação é puramente visual: leitores de tela recebem só o valor final,
 * sem serem inundados por atualizações a cada quadro.
 */
export function Counter({ value, prefix = '', suffix = '', className = '' }) {
  const ref = useCountUp(value, { prefix, suffix })
  const final = `${prefix}${value}${suffix}`

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  )
}
