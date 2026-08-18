import { renderToString } from 'react-dom/server'
import App from './App'

/**
 * Entrada usada SÓ no build, por scripts/prerender.mjs.
 *
 * Ela existe porque o site era 100% renderizado no navegador: o HTML publicado
 * era literalmente `<div id="root"></div>`. O Google executa JavaScript e
 * acabava vendo o conteúdo, mas:
 *
 *   · o rastreador do WhatsApp, do LinkedIn, do Facebook, do Discord e a maior
 *     parte dos rastreadores de IA NÃO executam JavaScript. Para eles a página
 *     não tinha um único parágrafo, e os dados estruturados (FAQ, serviços,
 *     projetos) simplesmente não existiam;
 *   · mesmo para o Google, renderizar custa uma segunda visita numa fila
 *     separada — o conteúdo demora mais para ser indexado e às vezes não é;
 *   · e o visitante olhava uma tela preta até o JavaScript baixar, executar e
 *     montar a árvore. O texto do Hero (o maior elemento da tela, ou seja o
 *     LCP) só aparecia no fim dessa corrente.
 *
 * O prerender resolve os três de uma vez: o HTML sai do build já com a página
 * inteira dentro, e o React apenas HIDRATA o que já está na tela.
 */
export function render() {
  return renderToString(<App />)
}
