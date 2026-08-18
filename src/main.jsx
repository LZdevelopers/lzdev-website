import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

/**
 * As fontes NÃO são importadas aqui.
 *
 * `import '@fontsource-variable/inter'` trazia os onze subconjuntos da família
 * (cirílico, grego, vietnamita…) para um site em português, e com nome de
 * arquivo com hash — o que impede o preload no <head>. Agora as duas famílias
 * são declaradas em src/styles/fonts.css, apontando para public/fonts, e o
 * index.html pré-carrega os dois arquivos. Ver scripts/copy-fonts.mjs.
 */
import './styles/index.css'
import App from './App'

const root = document.getElementById('root')

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

/**
 * HIDRATAR quando o HTML já veio pronto do build (o caso de produção, ver
 * scripts/prerender.mjs) e MONTAR do zero quando não veio (o `npm run dev`, que
 * serve o index.html com a div vazia).
 *
 * A diferença importa: `createRoot().render()` sobre um HTML já preenchido joga
 * fora tudo o que estava na tela e redesenha — o visitante vê a página piscar, e
 * o trabalho do prerender é desperdiçado. `hydrateRoot` reaproveita os nós que
 * já estão lá e só liga os eventos.
 */
if (root.firstChild) hydrateRoot(root, app)
else createRoot(root).render(app)
