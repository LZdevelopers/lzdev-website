/**
 * Cartão padrão da página: borda em gradiente, elevação sutil e um brilho fixo
 * que aparece no hover/foco.
 *
 * Nada aqui acompanha o cursor — o glow tem posição fixa (topo, centro) e só
 * transiciona a opacidade. Substituiu o antigo SpotlightCard, que lia a
 * posição do ponteiro a cada quadro.
 */
export function Card({ as: Tag = 'div', className = '', innerClassName = '', children, ...rest }) {
  return (
    <Tag
      className={`group relative isolate card-base border-gradient card-glow overflow-hidden transition-[box-shadow,border-color,transform] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-brand/40 hover:shadow-[var(--shadow-glow)] ${className}`}
      {...rest}
    >
      <div className={`relative z-10 ${innerClassName}`}>{children}</div>
    </Tag>
  )
}
