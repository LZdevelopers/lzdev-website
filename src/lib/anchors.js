/**
 * Rolagem até uma âncora da página, feita à mão — e o porquê de não ser o
 * comportamento nativo do link.
 *
 * O menu do celular precisa disso. Ele trava a rolagem do body enquanto está
 * aberto (`overflow: hidden`, senão a página rola atrás do painel). Ao tocar num
 * item, o navegador processa o salto da âncora no MESMO instante do clique —
 * antes de o React fechar o painel e devolver a rolagem. Resultado: o navegador
 * tenta rolar um documento travado, e o menu fecha com a página parada onde
 * estava. É o clássico "o menu do celular não vai para a seção".
 *
 * Aqui a ordem é invertida: o painel fecha primeiro, esperamos dois quadros para
 * a trava sair do body e só então rolamos.
 *
 * `scrollIntoView({ block: 'start' })` respeita `scroll-margin-top`, que é onde
 * mora o desconto da altura da barra fixa (src/styles/index.css). Ou seja: a
 * posição final é a MESMA do clique nativo no desktop — não existem duas contas
 * diferentes de offset para divergirem.
 *
 * O foco vai para a seção porque a rolagem sozinha não move o cursor do teclado:
 * sem isso, quem navega por Tab continuaria no menu, e o próximo Tab voltaria
 * para o topo da página em vez de seguir dentro da seção que acabou de abrir.
 */
const ROUTES = {
  '/': 'inicio',
  '/servicos': 'servicos',
  '/projetos': 'projetos',
  '/tecnologias': 'tecnologias',
  '/custo-invisivel': 'custo-invisivel',
  '/diferenciais': 'diferenciais',
  '/equipe': 'equipe',
  '/numeros': 'numeros',
  '/faq': 'faq',
  '/contato': 'contato',
}

const normalizePathname = (pathname) => (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname)

export function isSiteRoute(pathname) {
  return Object.hasOwn(ROUTES, normalizePathname(pathname))
}

/** Navega pelas seções sem expor âncoras na URL. */
export function scrollToAnchor(pathname, { updateHistory = true, focus = true, behavior } = {}) {
  const route = normalizePathname(pathname)
  const target = document.getElementById(ROUTES[route])
  if (!target) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: behavior || (reduce ? 'auto' : 'smooth'), block: 'start' })

  // `-1` = focável por script, nunca por Tab. `preventScroll` para o foco não
  // desfazer a rolagem suave que acabou de começar.
  if (focus) {
    target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }

  // A URL passa a valer para compartilhar e para o botão voltar, como no link
  // nativo. `pushState` (e não `replaceState`) preserva o histórico.
  if (updateHistory && window.location.pathname !== route) {
    window.history.pushState(null, '', route)
  }
}

/** Espera dois quadros — o suficiente para o React soltar a trava do body. */
export function afterTwoFrames(callback) {
  requestAnimationFrame(() => requestAnimationFrame(callback))
}
