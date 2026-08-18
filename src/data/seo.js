/**
 * Fonte única de verdade dos metadados do site.
 *
 * Tudo que depende do DOMÍNIO sai de `SITE_URL` — canonical, Open Graph,
 * sitemap, robots e JSON-LD. Trocar de domínio é editar UMA linha aqui e
 * rodar `npm run seo`, que reescreve as tags de index.html e os arquivos
 * estáticos de public/ a partir deste arquivo.
 *
 * ⚠️  Não existe cópia deste endereço em nenhum outro arquivo-fonte. Se você
 *     encontrar o domínio escrito à mão em algum lugar, é bug.
 */

/** Domínio final, SEM barra no fim. Confirmado pela LZdev em 18/08/2026. */
export const SITE_URL = 'https://lzdev.com.br'

/** URL absoluta de um caminho do site. `absolute('/')` → a home. */
export const absolute = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

export const site = {
  name: 'LZdev',
  /** Idioma da página — usado no <html lang> e no og:locale. */
  lang: 'pt-BR',
  locale: 'pt_BR',

  /**
   * Title da home. Regra: o QUE fazemos antes do nome da marca, porque é a
   * primeira metade que aparece inteira no resultado de busca.
   * Até 60 caracteres para o Google não cortar.
   */
  title: 'Desenvolvimento de Sites e Sistemas Web | LZdev',

  /**
   * Description: o que o visitante encontra na página, em linguagem de gente.
   * Até ~160 caracteres. Nenhuma palavra-chave repetida de propósito — o texto
   * existe para ser lido no resultado de busca, não para o robô contar termos.
   */
  description:
    'A LZdev desenvolve landing pages, sites institucionais e sistemas web sob medida. Escopo e prazo fechados, atendimento remoto em todo o Brasil.',

  /** Título e texto do cartão de compartilhamento (WhatsApp, LinkedIn, Discord). */
  ogTitle: 'LZdev — Sites e sistemas web sob medida',
  ogDescription:
    'Landing pages, sites institucionais e sistemas de gestão feitos do zero para a sua operação. Escopo e prazo fechados antes de começar.',

  /**
   * Imagem de compartilhamento: 1200x630 (a proporção que o Facebook, o
   * LinkedIn e o WhatsApp recortam sem cortar nada). Gerada por
   * `npm run og` a partir da arte da marca — ver scripts/generate-og.mjs.
   */
  ogImage: {
    path: '/og-cover.png',
    width: 1200,
    height: 630,
    type: 'image/png',
    alt: 'LZdev — desenvolvimento de sites e sistemas web sob medida',
  },

  /** Cor da barra do navegador no mobile — o mesmo preto do fundo do site. */
  themeColor: '#000000',
}

/**
 * Verificação do Google Search Console.
 *
 * Deixe em `null` até ter o valor REAL. Em Search Console → Adicionar
 * propriedade → prefixo de URL → "Tag HTML", copie apenas o conteúdo do
 * atributo `content` e cole aqui entre aspas. Depois rode `npm run seo`.
 *
 * Nunca preencha com um valor inventado: uma tag de verificação falsa não
 * valida a propriedade e só polui o <head>.
 */
export const googleSiteVerification = null

/**
 * As páginas que existem de verdade e devem ser indexadas — a base do
 * sitemap.xml. Hoje o site é UMA página: as seções são âncoras dela, e âncora
 * não é URL (o Google indexa a página, não o `#projetos`).
 *
 * `changefreq` e `priority` ficam de fora de propósito: o Google ignora os dois
 * desde 2023, e sitemap com campo ignorado é só arquivo maior.
 */
export const pages = [{ path: '/', lastmod: '2026-08-18' }]
