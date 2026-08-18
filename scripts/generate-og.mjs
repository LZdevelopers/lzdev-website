/**
 * Gera public/og-cover.png — a imagem que aparece quando alguém cola o link do
 * site no WhatsApp, no LinkedIn, no Discord ou no Facebook.
 *
 *   node scripts/generate-og.mjs      (ou: npm run og)
 *
 * POR QUE ESTE ARQUIVO EXISTE: o index.html anunciava
 * `og:image = /og-cover.png` e esse arquivo nunca existiu. Toda vez que o link
 * era compartilhado, a rede social buscava a imagem, recebia 404 e desenhava o
 * cartão cinza sem imagem — o pior cartão possível, porque parece site
 * abandonado. Uma tag de Open Graph apontando para o vazio é pior que não ter a
 * tag.
 *
 * A composição é a linguagem visual do próprio site, nos mesmos valores:
 * preto puro, a malha de 72px do fundo global, os halos de alfa baixíssimo, a
 * vinheta que ancora o conteúdo no escuro e a plataforma de luz sob a marca do
 * Hero. Nada aqui é inventado para a capa.
 *
 * ⚠️  A capa NÃO tem texto. Rasterizar a wordmark exigiria as curvas da Plus
 *     Jakarta Sans (que vivem comprimidas em .woff2) e o resultado com uma
 *     fonte aproximada seria uma marca errada — pior que marca nenhuma. As
 *     redes sociais desenham `og:title` e `og:description` como texto ao lado
 *     da imagem, então a informação não se perde. Para uma capa com wordmark e
 *     headline desenhados, exporte 1200x630 e sobrescreva public/og-cover.png:
 *     nada no código precisa mudar.
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { clamp01, encodePng } from './lib/png.mjs'
import { loadMark, publicDir } from './lib/mark.mjs'

/* 1200x630 é a proporção que Facebook, LinkedIn e WhatsApp recortam sem cortar
   nada — qualquer outra é redimensionada por eles, e aí o corte é sorte. */
const W = 1200
const H = 630

/** Lado da marca na capa: ~46% da altura, com respiro largo em volta. */
const MARK_SIZE = 290

const mark = loadMark()
const px = Buffer.alloc(W * H * 4)

/** Escreve um pixel opaco. A capa é 100% opaca: rede social ignora alpha. */
function put(x, y, r, g, b) {
  const o = (y * W + x) * 4
  px[o] = Math.round(clamp01(r) * 255)
  px[o + 1] = Math.round(clamp01(g) * 255)
  px[o + 2] = Math.round(clamp01(b) * 255)
  px[o + 3] = 255
}

/**
 * Luz branca somada ao fundo, em elipse com queda suave (a mesma ideia dos
 * `blur()` enormes do GridBackdrop: alfa baixo e raio grande, para o preto ter
 * temperatura em vez de ser uma chapa morta).
 */
function halo(x, y, { cx, cy, rx, ry, peak }) {
  const dx = (x - cx) / rx
  const dy = (y - cy) / ry
  const d = Math.hypot(dx, dy)
  if (d >= 1) return 0
  // queda quadrática suave: 1 no centro, 0 na borda, sem aresta visível
  const falloff = (1 - d) * (1 - d)
  return peak * falloff
}

const HALOS = [
  // topo, levemente à esquerda do centro — nunca simétrico, como no site
  { cx: W * 0.42, cy: H * 0.04, rx: W * 0.62, ry: H * 0.78, peak: 0.1 },
  { cx: W * 0.86, cy: H * 0.3, rx: W * 0.4, ry: H * 0.6, peak: 0.055 },
  // a "plataforma": achatada, sob a marca, como o piso de luz do Hero
  { cx: W * 0.5, cy: H * 0.62, rx: W * 0.3, ry: H * 0.16, peak: 0.13 },
]

/* -------------------------------------------------------------------------- */
/*  1 · FUNDO: malha, halos e vinheta                                         */
/* -------------------------------------------------------------------------- */
const GRID = 72 // o mesmo passo do backgroundSize do GridBackdrop
const GRID_ALPHA = 0.05

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    let light = 0
    for (const h of HALOS) light += halo(x, y, h)

    // Linha da malha: 1px, e só onde a máscara do site a deixaria aparecer —
    // nítida no alto e no centro, dissolvida nas bordas.
    const onGrid = x % GRID === 0 || y % GRID === 0
    if (onGrid) {
      const dx = (x - W * 0.5) / (W * 0.55)
      const dy = (y - H * 0.1) / (H * 0.9)
      const mask = clamp01(1 - Math.hypot(dx, dy))
      light += GRID_ALPHA * mask
    }

    // Vinheta: escurece do centro para as bordas, e é ela que faz a marca
    // parecer iluminada em vez de colada num quadrado cinza.
    const vx = (x - W * 0.5) / (W * 0.62)
    const vy = (y - H * -0.1) / (H * 0.98)
    const vignette = clamp01(1 - Math.max(0, Math.hypot(vx, vy) - 0.28) * 1.15)

    const v = light * vignette
    put(x, y, v, v, v)
  }
}

/* -------------------------------------------------------------------------- */
/*  2 · A MARCA, centrada e um pouco acima do meio óptico                     */
/* -------------------------------------------------------------------------- */
const art = mark.resample(mark.src.px, MARK_SIZE, 0.98)
const offsetX = Math.round((W - MARK_SIZE) / 2)
const offsetY = Math.round(H * 0.5 - MARK_SIZE * 0.56)

for (let j = 0; j < MARK_SIZE; j++) {
  for (let i = 0; i < MARK_SIZE; i++) {
    const s = (j * MARK_SIZE + i) * 4
    const a = art[s + 3] / 255
    if (a <= 0) continue

    const x = offsetX + i
    const y = offsetY + j
    const o = (y * W + x) * 4
    // A arte é branca: força 255 e mistura pelo alpha, como a placa dos ícones.
    for (let c = 0; c < 3; c++) {
      px[o + c] = Math.round(px[o + c] + (255 - px[o + c]) * a)
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  3 · RÉGUA DE LUZ sob a marca — o mesmo traço das elipses da plataforma     */
/* -------------------------------------------------------------------------- */
const RULE_Y = offsetY + MARK_SIZE + 46
const RULE_HALF = 150

for (let x = -RULE_HALF; x <= RULE_HALF; x++) {
  // acesa no meio, dissolvida nas duas pontas
  const t = 1 - Math.abs(x) / RULE_HALF
  const a = 0.55 * t * t
  const cx = Math.round(W / 2 + x)
  for (const y of [RULE_Y, RULE_Y + 1]) {
    const o = (y * W + cx) * 4
    const weight = y === RULE_Y ? a : a * 0.35
    for (let c = 0; c < 3; c++) px[o + c] = Math.round(px[o + c] + (255 - px[o + c]) * weight)
  }
}

const png = encodePng(W, H, px)
writeFileSync(join(publicDir, 'og-cover.png'), png)
console.log(`og-cover.png  ${W}x${H}  ${(png.length / 1024).toFixed(1)} kB`)
