/**
 * Revisão automática do build — a lista de conferência, executável.
 *
 *   npm run build && npm run check
 *
 * Ele lê dist/ (o site como o servidor vai entregá-lo) e verifica o que dá para
 * verificar sem abrir um navegador: âncoras que não existem, imagem sem alt,
 * hierarquia de headings furada, link externo sem rel, title comprido, JSON-LD
 * inválido, sitemap apontando para outro domínio, og:image que não foi
 * publicado. São exatamente os erros que ninguém vê olhando a tela — e que só
 * aparecem semanas depois, num relatório do Search Console.
 *
 * Sai com código 1 se encontrar ERRO (algo quebrado) e 0 com AVISOS (algo a
 * melhorar), para poder virar etapa de CI sem travar o time por um aviso.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { SITE_URL, absolute, site } from '../src/data/seo.js'
import { repoRoot } from './lib/mark.mjs'

const dist = join(repoRoot, 'dist')
const errors = []
const warnings = []
const notes = []

const fail = (message) => errors.push(message)
const warn = (message) => warnings.push(message)
const note = (message) => notes.push(message)

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html não existe — rode `npm run build` primeiro.')
  process.exit(1)
}

const html = readFileSync(join(dist, 'index.html'), 'utf8')

/* -------------------------------------------------------------------------- */
/*  1 · PRERENDER — o conteúdo chegou ao HTML?                                */
/* -------------------------------------------------------------------------- */
const root = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)
const rootHtml = root ? root[1] : ''
if (rootHtml.length < 10_000) {
  fail(
    `#root tem só ${rootHtml.length} bytes: o prerender não rodou, e o site será publicado em branco para quem não executa JavaScript (WhatsApp, LinkedIn, Facebook, Discord).`
  )
} else {
  note(`prerender: ${(rootHtml.length / 1024).toFixed(0)} kB de conteúdo dentro de #root`)
}

/* -------------------------------------------------------------------------- */
/*  2 · HEADINGS — um H1 e nenhum nível pulado                                */
/* -------------------------------------------------------------------------- */
const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({
  level: Number(m[1]),
  text: m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
}))

const h1s = headings.filter((h) => h.level === 1)
if (h1s.length !== 1) fail(`a página tem ${h1s.length} <h1> — precisa ter exatamente um.`)
else note(`H1: "${h1s[0].text}"`)

let previous = 0
for (const heading of headings) {
  if (previous && heading.level > previous + 1) {
    fail(`heading pula de H${previous} para H${heading.level} em "${heading.text}" — a estrutura fica mentindo sobre quem contém quem.`)
  }
  if (!heading.text) fail(`existe um H${heading.level} vazio.`)
  previous = heading.level
}
note(`headings: ${headings.filter((h) => h.level === 2).length} H2, ${headings.filter((h) => h.level === 3).length} H3, ${headings.filter((h) => h.level === 4).length} H4`)

/* -------------------------------------------------------------------------- */
/*  3 · LINKS — âncora que não existe, href morto, aba nova sem rel           */
/* -------------------------------------------------------------------------- */
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
const anchors = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)]

let internal = 0
let external = 0

for (const [, attrs, inner] of anchors) {
  const href = attrs.match(/href="([^"]*)"/)?.[1]
  const text = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const label = attrs.match(/aria-label="([^"]*)"/)?.[1]

  if (href === undefined) {
    fail(`existe um <a> sem href (texto: "${text || '—'}") — link que não leva a nada.`)
    continue
  }
  if (href === '' || href === '#') {
    fail(`link morto href="${href}" (texto: "${text || label || '—'}").`)
    continue
  }
  if (!text && !label) {
    fail(`link sem nome acessível para href="${href}" — leitor de tela anuncia só a URL.`)
  }

  if (href.startsWith('#')) {
    internal += 1
    const id = href.slice(1)
    if (!ids.has(id)) fail(`âncora "${href}" não existe na página (nenhum elemento com id="${id}").`)
  } else if (/^https?:\/\//.test(href)) {
    external += 1
    const target = attrs.match(/target="([^"]*)"/)?.[1]
    const rel = attrs.match(/rel="([^"]*)"/)?.[1] ?? ''
    if (target === '_blank' && !rel.includes('noopener')) {
      fail(`link externo abre em nova aba sem rel="noopener": ${href}`)
    }
  } else if (!href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('/')) {
    warn(`href com formato inesperado: ${href}`)
  }
}
note(`links: ${internal} internos (âncoras), ${external} externos, todos com destino`)

/* -------------------------------------------------------------------------- */
/*  4 · IMAGENS — alt sempre presente, dimensão declarada                     */
/* -------------------------------------------------------------------------- */
const images = [...html.matchAll(/<img\b([^>]*)>/g)].map((m) => m[1])
for (const attrs of images) {
  const src = attrs.match(/src="([^"]*)"/)?.[1] ?? '(sem src)'
  if (!/\salt="/.test(attrs)) {
    fail(`<img src="${src}"> sem atributo alt. (Decorativa? Então alt="" explícito.)`)
  }
  if (!/\swidth="/.test(attrs) || !/\sheight="/.test(attrs)) {
    warn(`<img src="${src}"> sem width/height — o layout pode pular quando a imagem chega.`)
  }
  if (src.startsWith('/') && !existsSync(join(dist, src.slice(1)))) {
    fail(`<img src="${src}"> aponta para um arquivo que não existe no build.`)
  }
}
note(`imagens: ${images.length}, todas com alt`)

/* -------------------------------------------------------------------------- */
/*  5 · METADADOS                                                             */
/* -------------------------------------------------------------------------- */
const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''
if (!title) fail('sem <title>.')
else if (title.length > 60) warn(`<title> com ${title.length} caracteres: o Google corta perto de 60. ("${title}")`)
else note(`<title> (${title.length} caracteres): "${title}"`)

const description = html.match(/<meta\s+name="description"[^>]*content="([^"]*)"/)?.[1] ?? ''
if (!description) fail('sem meta description.')
else if (description.length > 165) warn(`meta description com ${description.length} caracteres: o resultado de busca corta perto de 160.`)
else if (description.length < 70) warn(`meta description com só ${description.length} caracteres — sobra espaço para explicar melhor.`)
else note(`meta description: ${description.length} caracteres`)

const canonical = html.match(/<link\s+rel="canonical"[^>]*href="([^"]*)"/)?.[1]
if (!canonical) fail('sem <link rel="canonical">.')
else if (!canonical.startsWith(SITE_URL)) fail(`canonical aponta para fora do domínio configurado (${canonical} ≠ ${SITE_URL}).`)
else note(`canonical: ${canonical}`)

if (!/<html[^>]+lang="pt-BR"/.test(html)) fail('o <html> não declara lang="pt-BR".')
if (!/<meta\s+name="viewport"/.test(html)) fail('sem meta viewport — o site não se adapta ao celular.')

/* Open Graph: as tags existem E a imagem foi publicada de fato. */
for (const property of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) {
  if (!html.includes(`property="${property}"`)) fail(`sem ${property}.`)
}
const ogImage = html.match(/<meta\s+property="og:image"[^>]*content="([^"]*)"/)?.[1]
if (ogImage) {
  const file = ogImage.replace(SITE_URL, '')
  if (!existsSync(join(dist, file.replace(/^\//, '')))) {
    fail(`og:image aponta para ${ogImage}, que NÃO existe no build — o cartão de compartilhamento sai sem imagem.`)
  } else {
    note(`og:image publicada: ${file}`)
  }
}

/* -------------------------------------------------------------------------- */
/*  6 · JSON-LD                                                               */
/* -------------------------------------------------------------------------- */
const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
if (!blocks.length) fail('nenhum bloco JSON-LD no HTML — os dados estruturados não chegaram ao build.')
for (const [, raw] of blocks) {
  try {
    const data = JSON.parse(raw)
    const nodes = data['@graph'] ?? [data]
    note(`JSON-LD válido: ${nodes.map((n) => n['@type']).join(', ')}`)
    /* Marcação de avaliação sem avaliação na página é o motivo nº 1 de punição
       manual de dados estruturados. Se um dia alguém adicionar, o check reclama. */
    if (raw.includes('aggregateRating') || raw.includes('"review"')) {
      fail('o JSON-LD declara nota/avaliação. A página não exibe avaliações de clientes com autor e nota — isso é marcação enganosa.')
    }
  } catch (error) {
    fail(`JSON-LD inválido: ${error.message}`)
  }
}

/* -------------------------------------------------------------------------- */
/*  7 · ARQUIVOS QUE O BUSCADOR PROCURA                                       */
/* -------------------------------------------------------------------------- */
for (const file of ['robots.txt', 'sitemap.xml', 'site.webmanifest', '404.html', 'og-cover.png']) {
  if (!existsSync(join(dist, file))) fail(`dist/${file} não foi publicado.`)
}

if (existsSync(join(dist, 'robots.txt'))) {
  const robots = readFileSync(join(dist, 'robots.txt'), 'utf8')
  if (!robots.includes(absolute('/sitemap.xml'))) fail('robots.txt não aponta para o sitemap do domínio configurado.')
  if (/Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt tem "Disallow: /" — isso bloqueia o site inteiro.')
  if (/Disallow:.*\.(css|js)/i.test(robots)) fail('robots.txt bloqueia CSS ou JavaScript — o Google renderiza a página e veria um site quebrado.')
}

if (existsSync(join(dist, 'sitemap.xml'))) {
  const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8')
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  if (!locs.length) fail('sitemap.xml sem nenhuma <loc>.')
  for (const loc of locs) {
    if (!loc.startsWith(SITE_URL)) fail(`sitemap lista ${loc}, fora do domínio configurado.`)
    if (loc.includes('#')) fail(`sitemap lista uma âncora (${loc}) — âncora não é URL.`)
  }
  note(`sitemap: ${locs.length} URL(s) — ${locs.join(', ')}`)
}

/* -------------------------------------------------------------------------- */
/*  8 · O QUE PRECISA DE GENTE                                                */
/* -------------------------------------------------------------------------- */
const pendings = []
const siteData = readFileSync(join(repoRoot, 'src', 'data', 'site.js'), 'utf8')
for (const [, comment] of siteData.matchAll(/\/\/\s*FALTA:?\s*([^\n]*)/g)) pendings.push(comment.trim())
if (pendings.length) warn(`${pendings.length} pendência(s) marcadas com FALTA em src/data/site.js (dado real que ninguém informou ainda).`)

/* -------------------------------------------------------------------------- */
console.log(`\ncheck · ${site.name} · ${SITE_URL}\n`)
for (const message of notes) console.log(`  ok    ${message}`)
for (const message of warnings) console.log(`  aviso ${message}`)
for (const message of errors) console.log(`  ERRO  ${message}`)

console.log(
  `\n${errors.length} erro(s) · ${warnings.length} aviso(s)\n`
)
process.exit(errors.length ? 1 : 0)
