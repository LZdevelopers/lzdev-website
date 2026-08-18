/**
 * Copia para public/fonts/ apenas os arquivos de fonte que este site usa.
 *
 *   node scripts/copy-fonts.mjs      (ou: npm run fonts)
 *
 * DOIS PROBLEMAS QUE ISSO RESOLVE:
 *
 * 1 · PESO PUBLICADO. Importar `@fontsource-variable/inter` inteiro traz onze
 *     arquivos — cirílico, grego, grego estendido, vietnamita, latino estendido
 *     — e todos vão para o servidor no build (~296 kB de fonte). Um site em
 *     português usa UM: o subconjunto `latin`, cujo unicode-range (U+0000-00FF
 *     e mais alguns) cobre á, ã, ç, é, ê, í, ó, õ, ú e as aspas curvas. Os
 *     outros dez nunca serão baixados por ninguém — e ainda assim eram
 *     publicados.
 *
 * 2 · DESCOBERTA TARDIA. Dentro de node_modules o arquivo ganha hash no build,
 *     e um caminho com hash não pode ser pré-carregado pelo index.html. Em
 *     public/ o caminho é estável, então o <link rel="preload"> do <head> começa
 *     a baixar a fonte no primeiro instante, junto com o CSS — em vez de só
 *     depois que o navegador descobre que existe texto para desenhar com ela.
 *     O título do Hero é o maior elemento de texto da página (o LCP): é ele que
 *     ganha nesse adiantamento.
 *
 * O pacote npm continua sendo a FONTE: atualizar a fonte é `npm update` e rodar
 * este script, não trocar binário à mão.
 */
import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { publicDir, repoRoot } from './lib/mark.mjs'

/**
 * `wght-normal` é o arquivo variável de peso, no estilo normal: um arquivo
 * cobre 100–900 (Inter) e 200–800 (Jakarta), então não existe um download por
 * peso. Itálico não entra porque o site não usa nenhum texto itálico com estas
 * famílias — as falas do "custo invisível" são o `font-style: italic` sintético
 * do navegador sobre o mesmo arquivo.
 */
const FONTS = [
  '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  '@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2',
]

const target = join(publicDir, 'fonts')
mkdirSync(target, { recursive: true })

for (const font of FONTS) {
  const file = font.split('/').pop()
  copyFileSync(join(repoRoot, 'node_modules', font), join(target, file))
  console.log(`fonts/${file}`)
}
