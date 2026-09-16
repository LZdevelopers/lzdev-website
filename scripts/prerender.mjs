/**
 * Transforma o build num HTML estático completo.
 *
 *   node scripts/prerender.mjs      (o `npm run build` já roda)
 *
 * O `vite build` deixa em dist/index.html um documento com o <head> pronto e o
 * corpo vazio (`<div id="root"></div>`). Este script renderiza o App em texto
 * (usando o bundle de servidor gerado em dist-ssr/) e escreve o resultado dentro
 * dessa div — o mesmo HTML que o React produziria no navegador, só que já pronto
 * no arquivo. O JavaScript continua sendo carregado e assume a página por
 * hidratação; a diferença é que agora existe conteúdo antes dele.
 *
 * dist-ssr/ é lixo de build: é removido no fim, e nunca vai para o servidor.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { repoRoot } from './lib/mark.mjs'

const dist = join(repoRoot, 'dist')
const distSsr = join(repoRoot, 'dist-ssr')
const target = '<div id="root"></div>'

const { render } = await import(pathToFileURL(join(distSsr, 'entry-server.js')).href)
const app = render()

const indexPath = join(dist, 'index.html')
const html = readFileSync(indexPath, 'utf8')
if (!html.includes(target)) {
  throw new Error(`dist/index.html não tem ${target} — o prerender não sabe onde escrever`)
}

writeFileSync(indexPath, html.replace(target, `<div id="root">${app}</div>`), 'utf8')

// Cada URL de seção recebe uma cópia do HTML principal. Assim /projetos e os
// demais destinos funcionam também em hospedagem estática pura, sem depender de
// uma regra de rewrite do servidor.
const sectionRoutes = [
  'servicos',
  'projetos',
  'tecnologias',
  'custo-invisivel',
  'diferenciais',
  'equipe',
  'numeros',
  'faq',
  'contato',
]
const rendered = html.replace(target, `<div id="root">${app}</div>`)
for (const route of sectionRoutes) {
  const routeDir = join(dist, route)
  mkdirSync(routeDir, { recursive: true })
  writeFileSync(join(routeDir, 'index.html'), rendered, 'utf8')
}
rmSync(distSsr, { recursive: true, force: true })

/* Um número: se ele voltar a ficar perto de zero, o prerender parou de funcionar
   e o site voltou a ser publicado em branco — sem erro nenhum no build. */
console.log(`prerender · ${(app.length / 1024).toFixed(0)} kB de HTML dentro de #root`)
