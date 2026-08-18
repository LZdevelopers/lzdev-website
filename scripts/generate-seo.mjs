/**
 * Escreve TODOS os arquivos de SEO a partir de src/data/seo.js.
 *
 *   node scripts/generate-seo.mjs      (ou: npm run seo — e o build já roda)
 *
 * Saídas:
 *   · index.html          → o bloco entre <!-- SEO:START --> e <!-- SEO:END -->
 *   · public/robots.txt
 *   · public/sitemap.xml
 *   · public/site.webmanifest
 *
 * POR QUE UM GERADOR, e não os quatro arquivos escritos à mão: o domínio
 * aparece em oito lugares diferentes (canonical, og:url, og:image, twitter:image,
 * o Sitemap: do robots, o <loc> do sitemap, o start_url do manifest e o JSON-LD).
 * Escrito à mão, um deles fica para trás no dia em que o domínio mudar — e o
 * canonical apontando para o domínio antigo é o tipo de erro que faz o Google
 * indexar a página errada e ninguém descobrir por meses.
 *
 * O JSON-LD é a única peça que NÃO sai daqui: ele depende do conteúdo da página
 * (serviços, FAQ, projetos, equipe) e é montado em tempo de render por
 * src/components/layout/StructuredData.jsx, entrando no HTML pelo prerender.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { absolute, googleSiteVerification, pages, site } from '../src/data/seo.js'
import { publicDir, repoRoot } from './lib/mark.mjs'

const START = '<!-- SEO:START'
const END = '<!-- SEO:END -->'

/** Escapa o que vai dentro de um atributo HTML/XML. */
const esc = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const ogImage = absolute(site.ogImage.path)

/* -------------------------------------------------------------------------- */
/*  1 · index.html — o bloco de <head>                                        */
/* -------------------------------------------------------------------------- */
const head = `<!-- SEO:START — bloco GERADO a partir de src/data/seo.js por \`npm run seo\`,
         que o \`npm run build\` executa antes de qualquer coisa. Editar aqui
         funciona até o próximo build, e aí a alteração desaparece sem aviso:
         o domínio, o title, a description e o Open Graph moram no seo.js. -->
    <title>${esc(site.title)}</title>
    <meta
      name="description"
      content="${esc(site.description)}"
    />
    <meta name="author" content="${esc(site.name)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="theme-color" content="${esc(site.themeColor)}" />
    <meta name="apple-mobile-web-app-title" content="${esc(site.name)}" />
    <link rel="canonical" href="${esc(absolute('/'))}" />
    <link rel="manifest" href="/site.webmanifest" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="${esc(site.locale)}" />
    <meta property="og:site_name" content="${esc(site.name)}" />
    <meta property="og:url" content="${esc(absolute('/'))}" />
    <meta property="og:title" content="${esc(site.ogTitle)}" />
    <meta
      property="og:description"
      content="${esc(site.ogDescription)}"
    />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta property="og:image:type" content="${esc(site.ogImage.type)}" />
    <meta property="og:image:width" content="${site.ogImage.width}" />
    <meta property="og:image:height" content="${site.ogImage.height}" />
    <meta
      property="og:image:alt"
      content="${esc(site.ogImage.alt)}"
    />

    <!-- X / Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(site.ogTitle)}" />
    <meta
      name="twitter:description"
      content="${esc(site.ogDescription)}"
    />
    <meta name="twitter:image" content="${esc(ogImage)}" />
    <meta
      name="twitter:image:alt"
      content="${esc(site.ogImage.alt)}"
    />
${
  googleSiteVerification
    ? `
    <!-- Verificação da propriedade no Google Search Console -->
    <meta name="google-site-verification" content="${esc(googleSiteVerification)}" />`
    : `
    <!-- Google Search Console: a tag de verificação entra aqui automaticamente
         quando \`googleSiteVerification\` deixar de ser null em src/data/seo.js.
         Nunca preencha com um valor inventado — uma tag falsa não valida nada. -->`
}
    ${END}`

const indexPath = join(repoRoot, 'index.html')
const html = readFileSync(indexPath, 'utf8')
const from = html.indexOf(START)
const to = html.indexOf(END)
if (from === -1 || to === -1) {
  throw new Error(`index.html perdeu os marcadores ${START} ... ${END} — sem eles não há onde escrever`)
}
writeFileSync(
  indexPath,
  `${html.slice(0, from)}${head}${html.slice(to + END.length)}`,
  'utf8'
)

/* -------------------------------------------------------------------------- */
/*  2 · robots.txt                                                            */
/* -------------------------------------------------------------------------- */
/**
 * Libera tudo. Não existe área administrativa, painel nem página privada neste
 * site — a única coisa a esconder seria nada.
 *
 * O que NÃO entra aqui, de propósito: nenhum `Disallow` para /assets, CSS ou
 * JavaScript. Bloquear esses arquivos é o erro clássico de robots.txt: o Google
 * renderiza a página para avaliá-la e, sem o CSS e o JS, ele vê um site quebrado
 * e sem conteúdo — e avalia o que vê.
 */
const robots = `# robots.txt — ${site.name}
# Site institucional de uma página. Tudo aqui é público.

User-agent: *
Allow: /

# CSS, JavaScript e imagens ficam liberados de propósito: o Google precisa deles
# para renderizar e avaliar a página como um visitante a vê.

Sitemap: ${absolute('/sitemap.xml')}
`
writeFileSync(join(publicDir, 'robots.txt'), robots, 'utf8')

/* -------------------------------------------------------------------------- */
/*  3 · sitemap.xml                                                           */
/* -------------------------------------------------------------------------- */
/**
 * Só URLs que existem, respondem 200 e devem ser indexadas — hoje, uma.
 *
 * As seções (#servicos, #projetos, …) NÃO entram: âncora não é URL, e listar
 * `/#servicos` no sitemap faz o Google reportar a mesma página várias vezes,
 * cada uma canonicalizando para a raiz. A página 404 também fica fora, por
 * definição: ela existe justamente para NÃO ser indexada.
 */
const urls = pages
  .map(
    (page) => `  <url>
    <loc>${esc(absolute(page.path))}</loc>
    <lastmod>${esc(page.lastmod)}</lastmod>
  </url>`
  )
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Gerado por npm run seo a partir de src/data/seo.js. Não edite à mão. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap, 'utf8')

/* -------------------------------------------------------------------------- */
/*  4 · site.webmanifest                                                      */
/* -------------------------------------------------------------------------- */
/**
 * O manifest existe para o "adicionar à tela inicial" do celular: sem ele, o
 * atalho fica com o nome da aba e um ícone recortado pelo sistema.
 * `icon-maskable-512` é o mesmo desenho com a arte recuada, porque o Android
 * corta o ícone na forma dele (círculo, gota, quadrado arredondado).
 */
const manifest = {
  name: `${site.name} — ${site.title.split('|')[0].trim()}`,
  short_name: site.name,
  description: site.description,
  lang: site.lang,
  start_url: '/',
  scope: '/',
  display: 'minimal-ui',
  background_color: site.themeColor,
  theme_color: site.themeColor,
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}
writeFileSync(join(publicDir, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

console.log(`seo · ${absolute('/')}`)
console.log('  index.html        bloco <head> reescrito')
console.log(`  robots.txt        sitemap em ${absolute('/sitemap.xml')}`)
console.log(`  sitemap.xml       ${pages.length} URL${pages.length > 1 ? 's' : ''}`)
console.log('  site.webmanifest  3 ícones')
console.log(
  googleSiteVerification
    ? '  verificação do Search Console: presente'
    : '  verificação do Search Console: PENDENTE (googleSiteVerification = null em src/data/seo.js)'
)
