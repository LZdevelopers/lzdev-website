import { useEffect } from 'react'

/**
 * Publica a altura REAL da barra fixa em `--header-h`, no <html>.
 *
 * É disso que depende a navegação por âncora. O CSS precisa saber quanto o
 * cabeçalho cobre para descontar essa altura ao parar a rolagem
 * (`scroll-margin-top`), e havia duas formas erradas de resolver:
 *
 *   · chutar um valor fixo (`scroll-padding-top: 6rem`, que era o que estava
 *     aqui). Funciona até a barra mudar de altura — outro breakpoint, um logo
 *     maior, uma linha a mais —, e a partir daí toda âncora para no lugar
 *     errado, sempre, sem ninguém notar de onde vem;
 *   · medir uma vez na montagem. Erra na primeira rotação de tela.
 *
 * `ResizeObserver` resolve os dois: a variável acompanha a barra em qualquer
 * largura, em qualquer orientação, incluindo a mudança de altura ao rolar.
 *
 * @param {import('react').RefObject<HTMLElement>} ref elemento da barra fixa.
 */
export function useHeaderHeight(ref) {
  useEffect(() => {
    const node = ref.current
    if (!node) return

    const write = () => {
      document.documentElement.style.setProperty('--header-h', `${Math.round(node.offsetHeight)}px`)
    }

    write()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', write)
      return () => window.removeEventListener('resize', write)
    }

    const observer = new ResizeObserver(write)
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref])
}
