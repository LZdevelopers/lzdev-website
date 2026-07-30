import { Icon } from './Icon'

const base =
  'group relative inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform,filter] duration-300 ease-[var(--ease-out-soft)] active:translate-y-px disabled:opacity-60 disabled:pointer-events-none'

const sizes = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[0.95rem]',
  xl: 'h-14 px-6 text-[0.95rem] sm:h-15 sm:px-7 sm:text-base',
}

const variants = {
  primary:
    'bg-brand text-white shadow-[0_10px_36px_-12px_rgb(124_58_237/0.85)] hover:bg-brand-hover hover:shadow-[0_14px_44px_-10px_rgb(139_92_246/0.95)]',
  // Gradiente violeta→azul com luz interna na borda superior — CTA do Hero
  gradient:
    'bg-[linear-gradient(135deg,#7c3aed_0%,#5b5bf0_52%,#3b82f6_100%)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_14px_40px_-14px_rgb(99_102_241/0.9)] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.32),0_20px_52px_-14px_rgb(99_102_241/1)]',
  outline:
    'border border-white/12 bg-white/[0.03] text-ink backdrop-blur-sm hover:border-brand/45 hover:bg-white/[0.06]',
  // Cápsula escura com borda azul-violeta e brilho externo discreto — CTA do
  // cabeçalho. O ícone da esquerda recebe o azul da marca.
  glass:
    'border border-[rgb(129_110_247/0.5)] bg-[rgb(9_10_20/0.7)] text-ink backdrop-blur-md shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_10px_34px_-14px_rgb(99_102_241/0.75)] [&>svg]:text-[#7ea6ff] hover:border-[rgb(167_139_250/0.8)] hover:bg-[rgb(15_16_32/0.85)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_14px_44px_-12px_rgb(99_102_241/0.95)]',
  ghost: 'text-muted hover:text-ink hover:bg-white/[0.05]',
  accent:
    'bg-accent text-[#04212a] shadow-[0_10px_36px_-14px_rgb(34_211_238/0.8)] hover:brightness-110',
}

/**
 * Botão único para links e ações. Renderiza <a> quando recebe href.
 * A variante primária tem um brilho que atravessa o botão no hover (sheen).
 *
 * `pill` troca o raio por cápsula e `iconBadge` envolve o ícone da direita num
 * círculo translúcido — as duas formas usadas no Hero.
 */
export function Button({
  href,
  variant = 'primary',
  size = 'md',
  pill = false,
  icon,
  iconPosition = 'right',
  iconBadge = false,
  className = '',
  children,
  ...rest
}) {
  const Tag = href ? 'a' : 'button'
  const isButton = Tag === 'button'
  const sheen = variant === 'primary' || variant === 'accent' || variant === 'gradient'
  const trailing = Boolean(icon) && iconPosition === 'right'

  return (
    <Tag
      href={href}
      type={isButton ? rest.type || 'button' : undefined}
      className={`${base} ${pill ? 'rounded-full' : 'rounded-xl'} ${sizes[size]} ${variants[variant]} ${
        sheen ? 'overflow-hidden' : ''
      } ${trailing && iconBadge ? 'pr-2.5 sm:pr-3' : ''} ${className}`}
      {...rest}
    >
      {icon && iconPosition === 'left' ? <Icon name={icon} size={17} /> : null}
      <span className="relative z-10">{children}</span>

      {trailing && iconBadge ? (
        <span className="relative z-10 ml-1 grid size-8 place-items-center rounded-full bg-white/18 ring-1 ring-white/30 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5 sm:size-9">
          <Icon name={icon} size={15} />
        </span>
      ) : null}

      {trailing && !iconBadge ? (
        <Icon
          name={icon}
          size={17}
          className="relative z-10 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5"
        />
      ) : null}

      {sheen ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-[-18deg] bg-white/25 blur-md group-hover:animate-sheen motion-reduce:hidden"
        />
      ) : null}
    </Tag>
  )
}
