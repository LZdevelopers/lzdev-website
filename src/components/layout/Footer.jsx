import { activeSocials, contact, footer, whatsappLink } from '../../data/site'
import { brandColors, Icon } from '../primitives/Icon'
import { Logo } from './Logo'

const YEAR = new Date().getFullYear()

const SOCIALS = [
  {
    icon: 'whatsapp',
    label: 'WhatsApp',
    href: whatsappLink('Olá! Vim pelo site da LZdev e gostaria de conversar sobre um projeto.'),
    external: true,
  },
  { icon: 'mail', label: 'E-mail', href: `mailto:${contact.email}` },
  ...activeSocials.map((social) => ({ ...social, external: true })),
]

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-bg-soft/60">
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
          {/* Marca */}
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted">{footer.tagline}</p>

            {/* Cada rede na cor oficial dela. `--net` alimenta borda e fundo do
                hover; o e-mail não é marca (ícone de traço) e cai no branco. */}
            <ul className="mt-6 flex gap-2">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.external ? '_blank' : undefined}
                    rel={social.external ? 'noopener noreferrer' : undefined}
                    aria-label={social.label}
                    style={{ '--net': brandColors[social.icon] || '#ffffff' }}
                    className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted transition-[border-color,color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--net)_50%,transparent)] hover:bg-[color-mix(in_oklab,var(--net)_14%,transparent)] hover:text-ink"
                  >
                    <Icon name={social.icon} size={17} colored />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colunas de links */}
          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-xs font-semibold tracking-[0.18em] text-faint uppercase">{column.title}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted transition-colors duration-300 hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/8 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-faint">
            © {YEAR} LZdev. Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-2 text-xs text-faint">
            <span className="size-1.5 rounded-full bg-accent animate-pulse-dot" aria-hidden="true" />
            Desenvolvido pela própria LZdev — como todo projeto que entregamos.
          </p>
        </div>
      </div>
    </footer>
  )
}
