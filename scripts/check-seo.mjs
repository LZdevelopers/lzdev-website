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
/*  8 · REGRAS DE CONTEÚDO — preço, prazo e estatística não confirmada        */
/*                                                                            */
/*  A varredura roda no HTML PUBLICADO, não no código-fonte: assim ela pega o  */
/*  valor mesmo que ele venha de outro arquivo, de uma tradução ou de um CMS.   */
/*                                                                            */
/*  A severidade é POR REGRA, e não uma chave só para as três:                */
/*                                                                            */
/*    · PREÇO e PRAZO reprovam o build (`strict: true`). São decisão fechada   */
/*      da LZdev e o site está limpo dos dois — a trava existe para ninguém    */
/*      reintroduzir um "a partir de R$" ou um "2 a 3 semanas" sem perceber.   */
/*    · ESTATÍSTICA apenas AVISA. Os números da seção "Nossos números" (30+,   */
/*      20+, 10+, 100%) continuam no ar por decisão da LZdev e ainda não foram */
/*      confirmados. O aviso mantém a pendência à vista sem travar o trabalho  */
/*      de ninguém; vira `strict: true` no dia em que alguém confirmar os      */
/*      valores, ou eles saírem.                                               */
/* -------------------------------------------------------------------------- */

/**
 * Remove do texto todo elemento declarado como IMAGEM (`role="img"`).
 *
 * O painel do Hero é um deles: os números lá dentro ("R$ 48.750,00",
 * "+12,5% este mês", "50k") são dado fictício de um mockup, para a tela parecer
 * um sistema em uso — não são preço nem estatística da empresa. Sem esta
 * exclusão, a varredura reportaria a ilustração e o aviso perderia o sentido.
 *
 * O caminhamento conta `<div` e `</div>` para achar o fechamento certo, em vez
 * de chutar um `</div>` qualquer: dentro do painel há dezenas deles aninhados.
 */
function stripRoleImg(html) {
  let out = html
  let guard = 0
  while (guard++ < 50) {
    const at = out.indexOf('role="img"')
    if (at === -1) break
    const open = out.lastIndexOf('<div', at)
    if (open === -1) break

    let depth = 0
    let i = open
    let end = -1
    while (i < out.length) {
      if (out.startsWith('<div', i)) depth += 1
      else if (out.startsWith('</div>', i)) {
        depth -= 1
        if (depth === 0) {
          end = i + '</div>'.length
          break
        }
      }
      i += 1
    }
    if (end === -1) break
    out = out.slice(0, open) + ' ' + out.slice(end)
  }
  return out
}

/** Texto visível: sem tags, sem script/style, com as entidades mais comuns. */
const visibleText = stripRoleImg(rootHtml)
  .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')

/** Mostra o trecho em volta do achado, para o alerta ser acionável. */
const excerpt = (match, index) => {
  const from = Math.max(0, index - 40)
  return `…${visibleText.slice(from, index + match.length + 40).trim()}…`
}

const CONTENT_RULES = [
  {
    name: 'PREÇO',
    strict: true,
    /* R$ 1.800 · R$1.800,00 · 1.800 reais */
    pattern: /R\$\s?\d|\d+\s?reais\b/gi,
    why: 'valor publicado faz o visitante decidir por um número antes de saber o que está comprando.',
  },
  {
    name: 'PRAZO',
    strict: true,
    /* "em 7 dias" · "2 a 3 semanas" · "cerca de 1 semana" · "até 2 horas úteis" */
    pattern: /\b\d+\s?(?:a\s?\d+\s?)?(?:hora|horas|dia|dias|semana|semanas|m[eê]s|meses)\b/gi,
    why: 'prazo sem escopo é chute, e chute publicado vira promessa que alguém cobra.',
  },
  {
    name: 'ESTATÍSTICA NÃO CONFIRMADA',
    strict: false,
    /* "30+ projetos" · "100% de satisfação" · "10 anos de experiência" */
    pattern: /\b\d+\s?\+|\b\d{2,3}\s?% de \w+|\b\d+\s?anos de (?:experi[eê]ncia|mercado)/gi,
    why: 'número de vitrine sem alguém que confirme é o que uma revisão técnica derruba primeiro.',
  },
]

let clean = 0
for (const rule of CONTENT_RULES) {
  const hits = [...visibleText.matchAll(rule.pattern)]
  if (!hits.length) {
    clean += 1
    continue
  }
  for (const match of hits) {
    const message = `${rule.name} no texto da página ("${match[0]}") — ${rule.why} Contexto: ${excerpt(match[0], match.index)}`
    if (rule.strict) fail(message)
    else warn(message)
  }
}
note(
  `regras de conteúdo: ${clean} de ${CONTENT_RULES.length} limpas em ${(visibleText.length / 1024).toFixed(0)} kB de texto visível — preço e prazo reprovam o build, estatística não confirmada apenas avisa`
)

/* -------------------------------------------------------------------------- */
/*  9 · O QUE PRECISA DE GENTE                                                */
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
