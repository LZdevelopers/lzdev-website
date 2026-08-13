import { activeSocials, contact, footer, primaryWhatsapp, whatsappLink } from '../../data/site'
import { brandColors, Icon } from '../primitives/Icon'
import { Logo } from './Logo'

const YEAR = new Date().getFullYear()

const SOCIALS = [
  {
    icon: 'whatsapp',
    // Canal principal. O rótulo nomeia quem atende, como nas outras redes —
    // os dois números ficam lado a lado na seção de contato.
    label: `WhatsApp · ${primaryWhatsapp.person}`,
    href: whatsappLink('Olá! Vim pelo site da LZdev e gostaria de conversar sobre um projeto.'),
    external: true,
  },
  { icon: 'mail', label: 'E-mail', href: `mailto:${contact.email}` },
  ...activeSocials.map((social) => ({ ...social, external: true })),
]

/**
 * Os links das duas colunas de `footer.columns` entram numa faixa única.
 * O rodapé não precisa reconstruir o mapa do site — a página tem dez seções e a
 * navbar já leva a todas: aqui basta o atalho. Fundir as colunas apaga dois
 * títulos de seção e duas listas verticais, o que é quase metade da altura.
 */
const LINKS = footer.columns.flatMap((column) => column.links)

/**
 * Rodapé em duas faixas: marca + atalhos, e a linha legal com as redes.
 * Sem colunas, sem repetir contato (a seção acima é inteira sobre isso) e com o
 * respiro vertical cortado quase pela metade — é o fim da página, não mais uma
 * seção de conteúdo.
 */
export function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-bg-soft/60">
      <div className="container-page py-9 sm:py-10">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3.5 text-[0.82rem] leading-relaxed text-muted">{footer.tagline}</p>
          </div>

          <nav aria-label="Links do rodapé">
            {/* Grade em vez de linha fluida: com 8 atalhos, o `flex-wrap` deixava
                o último item órfão numa terceira linha. Em 2 colunas (mobile) e
                4 (a partir de sm) as duas fileiras fecham alinhadas, e a ordem
                por linha preserva os grupos originais de `footer.columns`. */}
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5 sm:grid-cols-4">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[0.82rem] text-muted transition-colors duration-300 hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-white/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-faint">
            © {YEAR} LZdev. Todos os direitos reservados.
            <span className="mx-2 hidden text-white/15 sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="block sm:inline">
              Desenvolvido pela própria LZdev — como todo projeto que entregamos.
            </span>
          </p>

          {/* Cada rede na cor oficial dela. `--net` alimenta borda e fundo do
              hover; o e-mail não é marca (ícone de traço) e cai no branco. */}
          <ul className="flex shrink-0 gap-2">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target={social.external ? '_blank' : undefined}
                  rel={social.external ? 'noopener noreferrer' : undefined}
                  aria-label={social.label}
                  // Com os perfis pessoais dos dois, há dois GitHub e dois
                  // Instagram na fileira: o title diz de quem é cada um.
                  title={social.label}
                  style={{ '--net': brandColors[social.icon] || '#ffffff' }}
                  className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-muted transition-[border-color,color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--net)_50%,transparent)] hover:bg-[color-mix(in_oklab,var(--net)_14%,transparent)] hover:text-ink"
                >
                  <Icon name={social.icon} size={16} colored />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
