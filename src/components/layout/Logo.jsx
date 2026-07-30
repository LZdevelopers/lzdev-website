/**
 * Marca da LZdev. Símbolo geométrico ("Z" angular sobre gradiente violeta→ciano)
 * + wordmark. Vetorial e inline: nítido em qualquer densidade, zero request.
 */
export function Logo({ className = '', showWordmark = true, size = 34 }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
        <defs>
          <linearGradient id="lz-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="55%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="9" fill="url(#lz-mark)" />
        <rect
          x="0.75"
          y="0.75"
          width="30.5"
          height="30.5"
          rx="9"
          fill="none"
          stroke="rgb(255 255 255 / 0.28)"
          strokeWidth="1.5"
        />
        <path
          d="M10 10.5h12L10 21.5h12"
          fill="none"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark ? (
        <span className="font-display text-[1.35rem] font-extrabold tracking-tight text-ink">
          LZ<span className="text-accent">dev</span>
        </span>
      ) : null}
    </span>
  )
}
