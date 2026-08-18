import { footer } from '../../data/site'
import { Logo } from './Logo'

/**
 * O ano é resolvido no BUILD (o HTML sai pronto do prerender) e de novo no
 * navegador ao hidratar. Nos primeiros dias de janeiro seguinte ao último build
 * os dois discordam, e sem `suppressHydrationWarning` no elemento abaixo o React
 * trataria isso como HTML divergente. É o único texto da página que depende de
 * quando a página é VISTA, não de quando foi escrita.
 */
const YEAR = new Date().getFullYear()

/**
 * Os links das duas colunas de `footer.columns` entram numa faixa única.
 * O rodapé não precisa reconstruir o mapa do site — a página tem dez seções e a
 * navbar já leva a todas: aqui basta o atalho. Fundir as colunas apaga dois
 * títulos de seção e duas listas verticais, o que é quase metade da altura.
 */
const LINKS = footer.columns.flatMap((column) => column.links)

/**
 * Rodapé em duas faixas: marca + atalhos, e a linha legal.
 * Sem colunas e sem NENHUM canal de contato: WhatsApp e e-mail estavam a uma
 * rolagem de distância dos mesmos canais na seção de Contato, que existe
 * inteira para isso. É o fim da página, não mais uma seção de conteúdo.
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
                  {/* `inline-block py-1` dá ao atalho 24px de altura de alvo,
                      o mínimo da WCAG 2.2 para link que não está no meio de uma
                      frase. O padding é transparente: nada muda na tela. */}
                  <a
                    href={link.href}
                    className="inline-block py-1 text-[0.82rem] text-muted transition-colors duration-300 hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-7 border-t border-white/8 pt-5">
          <p className="text-xs leading-relaxed text-faint" suppressHydrationWarning>
            © {YEAR} LZdev. Todos os direitos reservados.
            <span className="mx-2 hidden text-white/15 sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="block sm:inline">
              Desenvolvido pela própria LZdev — como todo projeto que entregamos.
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
